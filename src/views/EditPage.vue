<template>
  <div class="editor" id="editor-layout-main">
    <!-- <Spin tip="读取中" class="editor-spinner"> </Spin> -->

    <ADrawer title="设置面板" placement="right" width="400" :closable="true"> 设置面板 </ADrawer>
    <!-- <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">预览标题</div>
        <div class="iframe-container">预览</div>
      </div>
    </div> -->
    <AModal title="发布成功" width="700px" :footer="null"> 发布成功弹窗 </AModal>

    <ALayout>
      <ALayoutSider width="300" style="background: #fff">
        <div class="sidebar-container">
          <ListComp @addItem="handleAddItem" />
        </div>
      </ALayoutSider>
      <ALayout style="padding: 0 24px 24px">
        <ALayoutContent class="preview-container">
          <p>画布区域</p>
          <div class="preview-list">
            <EditWrapper
              v-for="ele in elements"
              :key="ele.id"
              :id="ele.id"
              @setActive="handleSetActive"
              :active="ele.id === (currentElement && currentElement.id)"
            >
              <TextComp :tag="ele.name" v-bind="ele.props" />

              <div class="img" v-if="ele.props.src">
                <ImageComp v-bind="ele.props" />
              </div>
            </EditWrapper>
          </div>
        </ALayoutContent>
      </ALayout>
      <ALayoutSider width="300" style="background: #fff" class="settings-panel">
        <ATabs type="card">
          <ATabPane key="component" tab="属性设置" class="no-top-radius">
            <PropsTable
              v-if="currentElement && currentElement.props"
              :props="currentElement?.props"
              @change="handleChange"
            />
            {{ currentElement && currentElement.props }}
          </ATabPane>
          <ATabPane key="layer" tab="图层设置"> 图层设置内容 </ATabPane>
          <ATabPane key="page" tab="页面设置">
            <div class="page-settings">页面设置content</div>
          </ATabPane>
        </ATabs>
      </ALayoutSider>
    </ALayout>
  </div>
</template>

<script setup lang="ts">
// import TextComp from '@/component/TextComp.vue'
import { TextComp } from 'editor-components-sw'
import ListComp from '@/component/ListComp.vue'
import ImageComp from '@/component/ImageComp.vue'
import { useEditStore } from '@/stores/edit'
import EditWrapper from '@/component/EditWrapper.vue'
import { computed } from 'vue'
import type { CompData } from '@/types/edit.'
import PropsTable from '@/component/PropsTable.vue'

const editStore = useEditStore()
const { addEditInfo, editInfo, getCurrentElement, setActive, updateComponent } = editStore
const elements = editInfo.components
const currentElement = computed<undefined | CompData>(() => getCurrentElement(editInfo))

const handleAddItem = (newData: CompData) => {
  addEditInfo(newData)
}

function handleSetActive(id: string) {
  setActive(editInfo, id)
}
function handleChange(e: any) {
  updateComponent(editInfo, e)
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
}
.header h4 {
  color: #ffffff;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  margin-top: 50px;
  max-height: 80vh;
}
.preview-list.active {
  border: 1px solid #1890ff;
}
.preview-list.canvas-fix .l-text-component,
.preview-list.canvas-fix .l-image-component,
.preview-list.canvas-fix .l-shape-component {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
.sidebar-container {
  padding: 20px;
}
.body-container {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.page-settings {
  padding: 16px;
}
.settings-panel .ant-tabs-top-content {
  max-height: calc(100vh - 68px - 56px);
  overflow-y: auto;
}
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  position: relative;
  background: url('~@/assets/phone-back.png') no-repeat;
  background-size: cover;
}
.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 50%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  background: url('~@/assets/loading.svg') 50% 50% no-repeat;
  background-size: 50px;
}
.settings-panel .ant-list-bordered {
  border-radius: 0;
}
.settings-panel .ant-collapse {
  border-radius: 0;
}
.ant-collapse-header,
.ant-collapse-item {
  border-radius: 0 !important;
}
.settings-panel .ant-tabs-tab {
  border-radius: 0 !important;
}
</style>
