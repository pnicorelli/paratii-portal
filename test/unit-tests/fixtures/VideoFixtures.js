export const getDefaultDataStatus = () => ({
  id: '',
  title: '',
  description: '',
  owner: '',
  ipfsHash: '',
  ipfsHashOrig: '',
  result: '',
  progress: 0,
  error: '',
  author: ''
})

export const getDefaultAsyncTaskStatus = () => ({
  name: 'idle',
  data: getDefaultDataStatus()
})

export const getDefaultVideo = () => ({
  description: '',
  filename: null,
  filesize: null,
  duration: null,
  author: '',
  free: '',
  published: null,
  id: '',
  ipfsHashOrig: '',
  ipfsHash: '',
  owner: '',
  price: '',
  thumbnails: [],
  title: '',
  storageStatus: getDefaultAsyncTaskStatus(),
  transcodingStatus: getDefaultAsyncTaskStatus(),
  uploadStatus: getDefaultAsyncTaskStatus(),
  fetchStatus: getDefaultAsyncTaskStatus()
})
