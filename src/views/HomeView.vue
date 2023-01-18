<script setup>
import { onMounted, ref, reactive } from 'vue';
import { Button as AButton, Modal as AModal, Input as AInput } from 'ant-design-vue';
import { detailList, addDetail } from '../services/detail';
import dayjs from 'dayjs';
import id from 'dayjs/locale/id'

const date = dayjs()
const dataList = ref([])
const visible =  ref(false)
const data = reactive({
  nama: '',
  pengeluaraan: '',
})

const total = (param) => {
  const data = dataList.value[param];

  let result = 0;
  data.map((item) => {
    result += item.pengeluaraan
  });

  return result
}

const fetchDetail = async() => {
  dataList.value = []
  await detailList()
    .then(response => {
      const temp = response.data.reduce((x, y) => {
        (x[y.tanggal] = x[y.tanggal] || []).push(y);

        return x;

        }, {});
        Object.keys(temp).forEach(function(key) {
          dataList.value = [...dataList.value, temp[key]]
        });
    })
    .catch(err => {
      console.error(err)
  })
}

const handleSubmit = async() => {
  const payload = {
    ...data,
    pengeluaraan: parseInt(data.pengeluaraan),
    tanggal: date.locale(id).format('DD MMMM YYYY'),
    jam: date.locale(id).format('H.m')
  }
  console.log(payload)
  await addDetail(payload)
    .then(response => {
      console.log(response)
      visible.value = false
      data.nama = ''
      data.pengeluaraan = ''
      fetchDetail()
    })
    .catch(err => {
      console.error(err)
  })
}

onMounted(()=> {
  fetchDetail()
})
</script>

<template>
  <main>
    <div class="container mx-auto text-center">
      <p class="text-2xl font-bold">Diari Jajan {{ date.locale('id').format('MMMM YYYY') }}</p>
      <p>pengeluaran : </p>
      <a-button type="primary" @click="()=> visible = true">Tambahkan Item</a-button>
      <div class="grid grid-cols-3">
        <div class="w-full m-3" v-for="(record, index) in dataList" :key="record">
          <div class="h-[200px] grid row-auto border-2 px-3" >
            <div class="grid grid-rows-1 text-start grid-cols-1 text-lg font-bold border-b-2 h-10">
              {{ record[0].tanggal }}
            </div>
            <div class="grid grid-rows-1 grid-cols-2 border-b-2" v-for="item in record" :key="item.id">
              <div class="text-start">
                {{ `${item.jam} ${item.nama}` }}
              </div>
              <div class="text-end">
                {{ item.pengeluaraan }}
              </div>
            </div>
            <div class="grid grid-rows-1 grid-cols-2">
              <div class="text-end font-bold">
                total
              </div>
              <div class="text-end font-bold">
                {{ total(index) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model:visible="visible" @ok="handleSubmit">
      <p>Tambah Entri</p>
      <div class="my-5 flex items-center">
        <div class="col-span-2 mr-5">Nama:</div>
        <a-input v-model:value="data.nama" placeholder="Nama"/>
      </div>
      <div class="my-5 flex items-center">
        <div class="col-span-2 mr-5">Harga:</div>
      <a-input v-model:value="data.pengeluaraan" placeholder="Harga"/>
      </div>
    </a-modal>
  </main>
</template>
