<script setup>
import workflowImage from '@/assets/img/workflow.png'
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])
const visibleState = ref(props.visible)
watch(
  () => props.visible,
  (newValue) => {
    visibleState.value = newValue
  }
)
const closeDialog = () => {
  visibleState.value = false
  emit('update:visible', false)
}
</script>
<template>
  <div>
    <Dialog
      v-model:visible="visibleState"
      :style="{ width: '90rem' }"
      header="Group WorkFlow"
      modal
      @update:visible="closeDialog($event)"
    >
      <Tabs value="0">
        <TabList>
          <Tab value="0">Group WorkFlow</Tab>
          <Tab value="1">Helper</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <Image :src="workflowImage" alt="Image" preview width="w-full" />
          </TabPanel>
          <TabPanel value="1">
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-2">
                <Tag class="w-32" rounded severity="info" value="Inprogress"></Tag>
                <div>Process is currently ongoing and will be completed soon.</div>
              </div>
              <!-- Assign -->
              <div class="flex items-center gap-2">
                <Tag class="w-32" rounded severity="primary" value="Assign"></Tag>
                <div>Task has been assigned to a team member and is waiting for a response.</div>
              </div>
              <!-- Planning -->
              <div class="flex items-center gap-2">
                <Tag class="w-32" rounded severity="warn" value="Planning"></Tag>
                <div>
                  Dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit,
                  sed quia non.
                </div>
              </div>
              <!-- Close -->
              <div class="flex items-center gap-2">
                <Tag class="w-32" rounded severity="danger" value="Close"></Tag>
                <div>Task has been completed and is closed.</div>
              </div>
              <!-- Pending Close -->
              <div class="flex items-center gap-2">
                <Tag class="w-32" rounded severity="secondary" value="Pending Close"></Tag>
                <div>Task is pending closure and requires final review.</div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <template #footer>
        <Button autofocus label="Close" severity="secondary" text @click="closeDialog" />
      </template>
    </Dialog>
  </div>
</template>
<style></style>
