<script setup></script>
<template>
  <div>
    <Hero
      title="My Cart"
      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    />
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <table class="table table-dark" v-if="cart.length > 0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cart" :key="item._id">
                <td style="width: 5%">{{ index + 1 }}</td>
                <td style="width: 55%">
                  <div class="d-flex align-items-start">
                    <img
                      :src="item.image"
                      width="150"
                      class="me-2"
                      height="100"
                    />
                    <div>
                      <h6>{{ item.title }}</h6>
                      <p>{{ item.description }}</p>
                    </div>
                  </div>
                </td>
                <td style="width: 20%">
                  <div class="d-flex align-items-center">
                    <input
                      type="number"
                      :value="item.count"
                      min="1"
                      :max="item.quantity"
                      @change="changeQuantity(item._id)"
                      class="form-control width100px bg-transparent text-white"
                    />
                    <i
                      class="fa-solid fa-trash-can text-danger ms-2"
                      @click="removeItem(item._id)"
                    ></i>
                  </div>
                </td>
                <td style="width: 20%">
                  {{ item.count }} X INR {{ item.price }} = INR
                  {{ item.price * item.count }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>
                  Total :- &nbsp;&nbsp; INR
                  {{
                    cart.reduce((a, b) => a + (b["price"] * b["count"] || 0), 0)
                  }}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="col-md-12 text-end mb-3" v-if="cart.length > 0">
          <button class="btn btn-danger btn-lg me-3" @click="clearCart">
            Clear Cart
          </button>
          <button
            class="btn btn-success btn-lg"
            v-text="isAuthenticated ? 'Checkout' : 'Login to checkout'"
            @click="checkout()"
          ></button>
        </div>
        <div class="col-md-12 text-center" v-else>
          <h2>No item in cart</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import Hero from "../components/Hero.vue";
export default {
  name: "Cart",
  data() {
    return {
      cart: [],
      timer: 0,
    };
  },
  components: {
    Hero,
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    ...mapGetters(["user"]),
    ...mapGetters(["localCart"]),
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    fetchCart() {
      var items = [];
      if (this.isAuthenticated) {
        items = JSON.parse(JSON.stringify(this.user.cart));
      } else {
        items = JSON.parse(JSON.stringify(this.localCart));
      }
      if (items.length > 0) {
        axios
          .post(
            `${
              process.env.VUE_APP_URL
                ? process.env.VUE_APP_URL
                : "http://localhost:3000"
            }/api/user/cart`,
            {
              items: items,
            }
          )
          .then((res) => {
            this.cart = res.data.data;
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    },
    clearCart() {
      if (this.isAuthenticated) {
        axios
          .post(
            `${
              process.env.VUE_APP_URL
                ? process.env.VUE_APP_URL
                : "http://localhost:3000"
            }/api/user/clear-cart`,
            {},
            {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            this.cart = [];
            this.$store.dispatch("checkAuth", res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        localStorage.removeItem("cart");
        this.cart = [];
        this.$store.dispatch("changeLocalCart");
      }
    },
    changeQuantity(id) {
      const updatedLive = this.cart.map((item) => {
        if (item._id == id) {
          item.count = parseInt(event.target.value);
        }
        return { id: item._id, count: item.count };
      });

      if (this.isAuthenticated) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          axios
            .post(
              `${
                process.env.VUE_APP_URL
                  ? process.env.VUE_APP_URL
                  : "http://localhost:3000"
              }/api/user/add-to-cart`,
              {
                cart: updatedLive,
              },
              {
                headers: {
                  "x-access-token": localStorage.getItem("token"),
                },
              }
            )
            .then((res) => {
              this.$store.dispatch("checkAuth", res.data.data);
            })
            .catch((err) => {
              console.log(err.response);
            });
        }, 2000);
      } else {
        const updatedLocal = JSON.parse(localStorage.getItem("cart")).filter(
          (item) => {
            if (item.id == id) {
              item.count = event.target.value;
            }
            return true;
          }
        );
        localStorage.setItem("cart", JSON.stringify(updatedLocal));
      }
    },
    removeItem(id) {
      const updatedLive = this.cart.filter((item) => {
        return item._id != id;
      });

      if (this.isAuthenticated) {
        axios
          .post(
            `${
              process.env.VUE_APP_URL
                ? process.env.VUE_APP_URL
                : "http://localhost:3000"
            }/api/user/add-to-cart`,
            {
              cart: updatedLive,
            },
            {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            this.$store.dispatch("checkAuth", res.data.data);
            this.cart = updatedLive;
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        const updatedLocal = JSON.parse(localStorage.getItem("cart")).filter(
          (item) => {
            return item.id != id;
          }
        );
        localStorage.setItem("cart", JSON.stringify(updatedLocal));
        this.$store.dispatch("changeLocalCart");
        this.cart = updatedLive;
      }
    },
    checkout() {
      if (!this.isAuthenticated) {
        localStorage.setItem("pathToLoadAfterLogin", "/cart");
        this.$router.push({ path: "/login" });
      } else {
        axios
          .post(
            `${
              process.env.VUE_APP_URL
                ? process.env.VUE_APP_URL
                : "http://localhost:3000"
            }/api/user/checkout`,
            {
              items: this.cart,
            },
            {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            var options = {
              key_id: process.env.VUE_APP_RZRPAY_ID,
              amount: res.data.data.amount_due,
              currency: res.data.data.currency,
              order_id: res.data.data.id,
              name: "S-Commerce",
              description: "Test Transaction",
              image: "https://vuejs.org/images/logo.png",
              handler: (response) => {
                axios
                  .post(
                    `${
                      process.env.VUE_APP_URL
                        ? process.env.VUE_APP_URL
                        : "http://localhost:3000"
                    }/api/user/place-order`,
                    {
                      items: this.cart,
                      amount: res.data.data.amount_due,
                      order_id: response.razorpay_order_id,
                      payment_id: response.razorpay_payment_id,
                      signature: response.razorpay_signature,
                    },
                    {
                      headers: {
                        "x-access-token": localStorage.getItem("token"),
                      },
                    }
                  )
                  .then((res) => {
                    this.$store.dispatch("checkAuth", res.data.data);
                    this.items = [];
                    this.$swal({
                      icon: "success",
                      text: "Order placed successfully.",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    alert(err.response.data);
                  });
              },
            };
            var rpz1 = new window.Razorpay(options);
            rpz1.open();
          })
          .catch((err) => {
            console.log(err);
            this.$swal({
              icon: "error",
              text: err.response.data.data.error.description,
            });
          });
      }
    },
  },
};
</script>

<style scoped>
.d-flex p {
  font-size: 12px;
}
.h6 {
  font-size: 14px;
}
@media screen and (max-width: 768px) {
  .d-flex {
    flex-direction: column;
  }
  img {
    margin-bottom: 10px;
  }
}
.width100px {
  max-width: 65px;
  min-width: 65px;
}
.fa-trash-can {
  cursor: pointer;
}
</style>
