<template>
    <AppLoading v-model:active="isLoading">
        <img src="../../assets/loading.gif" alt="loading">
    </AppLoading>
    <table class="table mt-4">
        <thead>
            <tr>
                <th scope="col">購買時間</th>
                <th scope="col">Email</th>
                <th scope="col">購買款項</th>
                <th scope="col">應付金額</th>
                <th scope="col">是否付款</th>
                <th scope="col">編輯</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="item in orders" :key="item.id+'後台訂單列表'" :class="{'text-secondary' : !item.is_paid}">
                <td>{{ $filters.date(item.create_at) }}</td>
                <td>{{ item.user.email }}</td>
                <td>
                    <ul class="list-unstyled">
                        <li v-for="(product,i) in item.products" :key="i+'訂單'">
                            {{ product.product.title }}數量&nbsp;:&nbsp;{{ product.qty }}
                            {{ product.product.unit }}
                        </li>
                    </ul>
                </td>
                <td>${{ item.total }}</td>
                <td>
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            :id="`orderSwitch${item.id}`"
                            v-model="item.is_paid"
                            @change='()=>changeOrderStatus(item)'
                            :disabled="loadingItem === item.id"
                        >
                        <label class="form-check-label" :for="`orderSwitch${item.id}`">
                            <span v-if="item.is_paid">已付款</span>
                            <span v-else>未付款</span>
                        </label>
                    </div>
                </td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button type="button" class="btn btn-outline-primary btn-sm" @click="()=>openModal(item)">
                            檢視
                        </button>
                        <button
                            type="button"
                            class="btn btn-outline-danger btn-sm"
                            @click="()=>openDelModal(item)"
                        >
                            刪除
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="d-flex justify-content-center">
      <Pagination :pages="pages" @emit-pages="getOrders"></Pagination>
    </div>
    <ModalOrder
      @update-order-status="changeOrderStatus"
      :product-order="tempOrder"
      ref="orderModal"
    ></ModalOrder>
    <DelModal
      :item="tempOrder"
      @del-item="delOrder"
      ref="delModal"
    >
    </DelModal>
</template>

<script>
import Swal from 'sweetalert2'
import ModalOrder from '@/components/ModalOrder.vue'
import DelModal from '@/components/DelModal.vue'
import Pagination from '@/components/PaginationView.vue'
const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data () {
    return {
      orders: {},
      tempOrder: {},
      isLoading: false,
      isUpdatingLoading: false,
      loadingItem: '',
      pages: {},
      currentPage: 1
    }
  },
  components: {
    ModalOrder,
    Pagination,
    DelModal
  },
  methods: {
    getOrders (page = 1) {
      this.currentPage = page
      if (!this.isUpdatingLoading) {
        this.isLoading = true
      }
      this.$http.get(`${VITE_URL}api/${VITE_PATH}/admin/orders/?page=${page}`)
        .then(res => {
          this.orders = res.data.orders
          this.pages = res.data.pagination
          this.isLoading = false
        })
        .catch(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: '資料取得失敗(｡◕∀◕｡)',
            showConfirmButton: false,
            timer: 1000,
            toast: true
          })
        })
    },
    changeOrderStatus (item) {
      this.isUpdatingLoading = true
      const paid = {
        is_paid: item.is_paid
      }
      this.loadingItem = item.id
      this.$http.put(`${VITE_URL}api/${VITE_PATH}/admin/order/${item.id}`, { data: paid })
        .then(() => {
          this.loadingItem = ''
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '訂單修改成功(｡◕∀◕｡)',
            showConfirmButton: false,
            timer: 1000,
            toast: true
          })
          this.getOrders()
          const orderComponent = this.$refs.orderModal
          orderComponent.hideModal()
        })
        .catch(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: '訂單修改失敗(｡◕∀◕｡)',
            showConfirmButton: false,
            timer: 1000,
            toast: true
          })
        })
    },
    openModal (item) {
      this.tempOrder = { ...item }
      const orderComponent = this.$refs.orderModal
      orderComponent.openModal()
    },
    openDelModal (item) {
      this.tempOrder = { ...item }
      const orderComponent = this.$refs.delModal
      orderComponent.openModal()
    },
    delOrder () {
      this.$http.delete(`${VITE_URL}api/${VITE_PATH}/admin/order/${this.tempOrder.id}`)
        .then(res => {
          const orderComponent = this.$refs.delModal
          orderComponent.hideModal()
          this.getOrders(this.currentPage)
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '成功刪除單一產品d(`･∀･)b',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          })
        })
        .catch(() => {
          Swal.fire({
            icon: 'success',
            title: '刪除單一品項失敗٩(ŏ﹏ŏ、)۶',
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
  },
  mounted () {
    this.getOrders()
  }
}
</script>

<style lang="scss" scoped>

</style>
