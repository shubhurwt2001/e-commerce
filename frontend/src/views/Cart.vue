<script setup>
import { RouterLink } from "vue-router";
</script>
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
                <td style="width: 20%">{{ item.count }}</td>
                <td style="width: 20%">
                  {{ item.count }} X $ {{ item.price }} = $
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
                  Total :- &nbsp;&nbsp; $
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
          <RouterLink
            class="btn btn-success btn-lg"
            v-text="isAuthenticated ? 'Checkout' : 'Login to checkout'"
            to="/checkout"
          />
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
          .post(`${process.env.URL ? process.env.URL : 'http://localhost:3000'}/api/user/cart`, {
            items: items,
          })
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
            `${process.env.URL ? process.env.URL : 'http://localhost:3000'}/api/user/clear-cart`,
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
</style>
