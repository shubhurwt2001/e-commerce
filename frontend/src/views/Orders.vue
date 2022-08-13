<script setup>
import moment from "moment";
</script>
<template>
  <div>
    <Hero
      title="My Orders"
      description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    />
    <div class="container">
      <div class="row">
        <div class="col-md-12" v-if="user.orders.length > 0">
          <div v-for="items in user.orders" :key="items.order_id">
            <h4>
              Order ID : <span class="text-success">{{ items.order_id }}</span>
            </h4>
            <h4>
              Order Date :
              <span class="text-success">{{
                moment(items.date).format("LL ( hh:mm A )")
              }}</span>
            </h4>
            <table class="table table-dark">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items.items" :key="item._id">
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
                    {{ item.count }}
                  </td>
                  <td style="width: 20%">
                    {{ item.count }} X ₹ {{ item.price }} = ₹
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
                    Total :- &nbsp;&nbsp; ₹
                    {{
                      items.items.reduce(
                        (a, b) => a + (b["price"] * b["count"] || 0),
                        0
                      )
                    }}
                  </th>
                </tr>
              </tfoot>
            </table>
            <div class="separator"></div>
          </div>
        </div>
        <div class="col-md-12 text-center" v-else>
          <h2>No item in cart</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Hero from "../components/Hero.vue";

export default {
  name: "Orders",
  computed: {
    ...mapGetters(["user"]),
  },
  components: { Hero },
};
</script>

<style scoped>
.separator {
  height: 4px;
  width: 100%;
  background: #f5f5f5;
  margin: 50px 0 40px;
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
