/* @flow */

import { createAction } from 'redux-actions'
import { paratii } from 'utils/ParatiiLib'

import { UPLOAD_REQUESTED, UPLOAD_PROGRESS, UPLOAD_SUCCESS, UPDATE_UPLOAD_INFO } from 'constants/ActionConstants'

import type { Dispatch } from 'redux'

import VideoInfoRecord from 'records/VideoInfoRecords'

const uploadRequested = createAction(UPLOAD_REQUESTED)
const uploadProgress = createAction(UPLOAD_PROGRESS)
const uploadSuccess = createAction(UPLOAD_SUCCESS)
const updateUploadInfo = createAction(UPDATE_UPLOAD_INFO)

export const upload = (file: Object) => (dispatch: Dispatch<*>) => {
  // the next call dispatches an asynchronous request to upload the file to ipfs
  // (the API will change and become paratii.ipfs.add(..))

  let uploader = paratii.ipfs.uploader.add(file)
  uploader.on('start', () => {
    console.log('Uploading file', file)
    dispatch(uploadRequested())
  })

  uploader.on('progress', (chunkLength, percent) => {
    dispatch(uploadProgress(percent))
  })

  uploader.on('error', (err) => {
    if (err) {
      console.log('[UPLOAD error]', err)
    }
  })

  uploader.on('fileReady', (file) => {
    dispatch(uploadSuccess(file.hash))
  })

  uploader.on('done', (files) => {
    console.log('[UPLOAD done]', files)
  })
}

export const saveVideoInfo = (videoInfo: Object) => (dispatch: Dispatch<*>) => {
  // console.log('Saving video info')
  // // TODO: paratii-lib shoudl generate a fresh id, we now use a placeholder
  // videoInfo.id = `foo_${Math.floor(Math.random() * 100000)}`
  // // the owner is the user that is logged in
  // videoInfo.owner = paratii.config.account.address
  // // TODO: paratii-lib has no support for the description yet (there is an issue)
  // // TODO: once that support is there, the following line should be deleted
  // delete videoInfo.description
  // console.log(videoInfo)
  // paratii.core.vids.create(videoInfo).then((videoInfo) => {
  //   console.log('Video successfully uploaded!')
  //   dispatch(updateUploadInfo(videoInfo))
  // })
  dispatch(updateUploadInfo(new VideoInfoRecord(videoInfo)))
}
