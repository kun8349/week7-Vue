<template>
    <div>
        <h2>單一產品介紹</h2>
        <div class="row">
            <div class="col-md-4">
                <img :src="product.imageUrl" alt="主要圖片" class="img-fluid w-100">
                <div class="row mt-3">
                    <div class="col-md-6" v-for="(image,index) in product.imagesUrl" :key="index+'image'">
                        <img :src="image" alt="次要圖片" class="img-fluid">
                    </div>
                </div>
            </div>
            <div class="col-md-8 text-start d-flex justify-content-between flex-column">
                <div class="p-3 pt-0">
                    <span class="badge rounded-pill text-bg-primary fs-5 text-white mb-3">
                        {{ product.category }}
                    </span>
                    <p class="fs-5">商品名稱:{{ product.title }}</p>
                    <p class="fs-5">商品內容:{{ product.description }}</p>
                </div>
                <div class="row">
                    <div class="col-md-6"></div>
                    <div class="col-md-6 text-end">
                        <div class="input-group text-end mt-5">
                          <input type="number" min="1" class="form-control w-50"
                          v-model="NewQty" :disabled="loadingItem === product.id">
                          <button class="btn btn-primary btn-lg" @click="addCart(product.id, NewQty)"
                          :disabled="loadingItem === product.id">
                            加入購物車
                            <img src="../../assets/loading.gif" alt="loading" width="20" v-if="loadingItem === product.id">
                          </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data () {
    return {
      product: {},
      NewQty: 1,
      loadingItem: ''
    }
  },
  methods: {
    getProduct () {
      this.$http.get(`${VITE_URL}/api/${VITE_PATH}/product/${this.$route.params.id}`)
        .then(res => {
          this.product = res.data.product
          this.NewQty = 1
        })
    },
    addCart (item, qty) {
      const data = {
        product_id: item,
        qty
      }
      this.loadingItem = item
      this.$http.post(`${VITE_URL}api/${VITE_PATH}/cart`, { data })
        .then(res => {
          this.loadingItem = ''
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '加入購物車成功(ﾉ>ω<)ﾉ',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          })
          this.getProduct()
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: '加入購物車失敗(‘⊙д-)',
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>

<style lang="scss" scoped>
</style>
