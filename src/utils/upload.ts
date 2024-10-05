import type { CheckOption, ErrorType } from '@/types/utils'
import { message } from 'ant-design-vue'
import SparkMD5 from 'spark-md5'

export function checkUpload(file: File, checkOption: CheckOption) {
  const { format, size } = checkOption

  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  const isValidFormat = format ? format.includes(file.type) : true
  let error: ErrorType = ''
  if (!isValidFormat) error = 'formatError'
  if (!isValidSize) error = 'sizeError'

  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

export function commonUploadCheck(file: File) {
  const result = checkUpload(file, { format: ['image/png', 'image/jpeg'], size: 1 })
  const { error, passed } = result
  if (error === 'formatError') message.error('上传图片只能是JPG/PNG格式')
  if (error === 'sizeError') message.error('上传图片应该小于1MB')

  return passed
}

export function getImageSize(url: string) {
  return new Promise<{ naturalHeight: number; naturalWidth: number }>((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.addEventListener('load', () => {
      const { naturalHeight, naturalWidth } = img
      resolve({ naturalHeight, naturalWidth })
    })

    img.addEventListener('error', () => {
      reject(new Error('获取文件信息失败'))
    })
  })
}

/* 通过 md5 加密文件 buffer 来生成唯一 hash 值  */
export async function getFileHash(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e: Event) => {
      const fileHash = SparkMD5.ArrayBuffer.hash(e.target?.result)
      resolve(fileHash)
    }
    fileReader.onerror = () => {
      reject('文件读取失败')
    }
    fileReader.readAsArrayBuffer(file)
  })
}
