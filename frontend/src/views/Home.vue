<template>
  <div>
    <Hero
      title="Welcome"
      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    />
    <div class="container">
      <div class="row">
        <div
          class="col-xl-3 col-lg-3 col-md-3 my-2"
          v-for="product in products"
          :key="product._id"
        >
          <div class="card">
            <div
              class="card-header"
              :style="{ 'background-image': 'url(' + product.image + ')' }"
            >
              <div class="product-details">
                <div class="price">INR {{ product.price }}</div>
                <div class="quantity">{{ product.quantity }} left</div>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">
                {{ product.description }}
              </p>
              <a
                href="javascript:void(0)"
                v-if="!isAuthenticated"
                @click="addToLocalCart(product._id, product.quantity)"
                class="btn btn-primary"
                >Add to cart</a
              >
              <a
                href="javascript:void(0)"
                v-if="isAuthenticated"
                @click="addToCart(product._id, product.quantity, user._id)"
                class="btn btn-primary"
                >Add to cart</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Hero from "../components/Hero.vue";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Home",
  components: { Hero },
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.getProducts();
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    // ...mapGetters(["user"]),
  },
  methods: {
    ...mapActions(["changeLocalCart"]),
    ...mapGetters(["user"]),
    getProducts() {
      axios(`${process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'http://localhost:3000'}/api/user/products`)
        .then((res) => {
          this.products = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addToLocalCart(id, max) {
      const cart = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
      const filtered = cart.filter((item) => {
        return item.id == id;
      });
      if (filtered.length > 0) {
        if (filtered[0].count >= max) {
          return this.$swal({
            text: `You can't add quantity more than ${max} for this product.`,
            icon: "error",
          });
        } else {
          filtered[0].count++;
        }
      } else {
        cart.push({ id, count: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      this.changeLocalCart();
      this.$swal({ text: "Item added to cart", icon: "success" });
    },

    addToCart(id, max) {
      const cart = this.user().cart;
      const filtered = cart.filter((item) => {
        return item.id == id;
      });
      if (filtered.length > 0) {
        if (filtered[0].count >= max) {
          return this.$swal({
            text: `You can't add quantity more than ${max} for this product.`,
            icon: "error",
          });
        } else {
          filtered[0].count++;
        }
      } else {
        cart.push({ id, count: 1 });
      }

      axios
        .post(
          `${process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'http://localhost:3000'}/api/user/add-to-cart`,
          {
            cart,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          this.$store.dispatch("checkAuth", res.data.data);
          this.$swal({ text: "Item added to cart", icon: "success" });
        })
        .catch((err) => {
          this.$swal({ text: err.response.data.error, icon: "error" });
        });
    },
  },
};
</script>
<style scoped>
.card-header {
  height: 10rem;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 2px;
}
.product-details {
  display: flex;
  justify-content: flex-end;
}
.price,
.quantity {
  background: rgba(0, 0, 0, 1);
  color: #fff;
  padding: 6px;
  border-radius: 4px;
  margin: 2px;
  font-weight: bold;
}
</style>
