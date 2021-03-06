/* eslint prefer-template: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const DropzoneWrapper = styled.div`
  cursor: pointer;
  width: 200px;
  height: 200px;
  border: 2px dashed #ccc;
  background: #666;
  padding: 20px;
  font-size: 15px;
`

class Dropzone extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.composeHandlers = this.composeHandlers.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onDocumentDrop = this.onDocumentDrop.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onFileDialogCancel = this.onFileDialogCancel.bind(this)
    this.onInputElementClick = this.onInputElementClick.bind(this)

    this.setRef = this.setRef.bind(this)
    this.setRefs = this.setRefs.bind(this)

    this.isFileDialogActive = false

    this.state = {
      draggedFiles: [],
      acceptedFiles: [],
      rejectedFiles: []
    }
  }

  componentDidMount () {
    const { preventDropOnDocument } = this.props
    this.dragTargets = []

    if (preventDropOnDocument) {
      document.addEventListener('dragover', onDocumentDragOver, false)
      document.addEventListener('drop', this.onDocumentDrop, false)
    }
    this.fileInputEl.addEventListener('click', this.onInputElementClick, false)
    // Tried implementing addEventListener, but didn't work out
    document.body.onfocus = this.onFileDialogCancel
  }

  componentWillUnmount () {
    const { preventDropOnDocument } = this.props
    if (preventDropOnDocument) {
      document.removeEventListener('dragover', onDocumentDragOver)
      document.removeEventListener('drop', this.onDocumentDrop)
    }
    if (this.fileInputEl != null) {
      this.fileInputEl.removeEventListener(
        'click',
        this.onInputElementClick,
        false
      )
    }
    // Can be replaced with removeEventListener, if addEventListener works
    if (document != null) {
      document.body.onfocus = null
    }
  }

  composeHandlers (handler) {
    if (this.props.disabled) {
      return null
    }

    return handler
  }

  onDocumentDrop (evt) {
    // TODO error Uncaught TypeError: this.node.contains is not a function
    // if (this.node && this.node.contains(evt.target)) {
    if (this.node) {
      // if we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
      return
    }
    evt.preventDefault()
    this.dragTargets = []
  }

  onDragStart (evt) {
    if (this.props.onDragStart) {
      this.props.onDragStart.call(this, evt)
    }
  }

  onDragEnter (evt) {
    evt.preventDefault()
    // Count the dropzone and any children that are entered.
    if (this.dragTargets.indexOf(evt.target) === -1) {
      this.dragTargets.push(evt.target)
    }

    this.setState({
      isDragActive: true, // Do not rely on files for the drag state. It doesn't work in Safari.
      draggedFiles: getDataTransferItems(evt)
    })

    if (this.props.onDragEnter) {
      this.props.onDragEnter.call(this, evt)
    }
  }

  onDragOver (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    try {
      // The file dialog on Chrome allows users to drag files from the dialog onto
      // the dropzone, causing the browser the crash when the file dialog is closed.
      // A drop effect of 'none' prevents the file from being dropped
      evt.dataTransfer.dropEffect = this.isFileDialogActive ? 'none' : 'copy' // eslint-disable-line no-param-reassign
    } catch (err) {
      // continue regardless of error
    }

    if (this.props.onDragOver) {
      this.props.onDragOver.call(this, evt)
    }
    return false
  }

  onDragLeave (evt) {
    evt.preventDefault()

    // Only deactivate once the dropzone and all children have been left.
    this.dragTargets = this.dragTargets.filter(
      el => el !== evt.target && this.node.contains(el)
    )
    if (this.dragTargets.length > 0) {
      return
    }

    // Clear dragging files state
    this.setState({
      isDragActive: false,
      draggedFiles: []
    })

    if (this.props.onDragLeave) {
      this.props.onDragLeave.call(this, evt)
    }
  }

  onDrop (evt) {
    const {
      onDrop,
      onDropAccepted,
      onDropRejected,
      multiple,
      disablePreview,
      accept
    } = this.props
    const fileList = getDataTransferItems(evt)
    const acceptedFiles = []
    const rejectedFiles = []

    // Stop default browser behavior
    evt.preventDefault()

    // Reset the counter along with the drag on a drop.
    this.dragTargets = []
    this.isFileDialogActive = false

    fileList.forEach(file => {
      if (!disablePreview) {
        try {
          file.preview = window.URL.createObjectURL(file) // eslint-disable-line no-param-reassign
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to generate preview for file', file, err) // eslint-disable-line no-console
          }
        }
      }

      if (
        fileAccepted(file, accept) &&
        fileMatchSize(file, this.props.maxSize, this.props.minSize)
      ) {
        acceptedFiles.push(file)
      } else {
        rejectedFiles.push(file)
      }
    })

    if (!multiple) {
      // if not in multi mode add any extra accepted files to rejected.
      // This will allow end users to easily ignore a multi file drop in "single" mode.
      rejectedFiles.push(...acceptedFiles.splice(1))
    }

    if (onDrop) {
      onDrop.call(this, acceptedFiles, rejectedFiles, evt)
    }

    if (rejectedFiles.length > 0 && onDropRejected) {
      onDropRejected.call(this, rejectedFiles, evt)
    }

    if (acceptedFiles.length > 0 && onDropAccepted) {
      onDropAccepted.call(this, acceptedFiles, evt)
    }

    // Clear files value
    this.draggedFiles = null

    // Reset drag state
    this.setState({
      isDragActive: false,
      draggedFiles: [],
      acceptedFiles,
      rejectedFiles
    })
  }

  onClick (evt) {
    const { onClick, disableClick } = this.props
    if (!disableClick) {
      evt.stopPropagation()

      if (onClick) {
        onClick.call(this, evt)
      }

      // in IE11/Edge the file-browser dialog is blocking, ensure this is behind setTimeout
      // this is so react can handle state changes in the onClick prop above above
      // see: https://github.com/react-dropzone/react-dropzone/issues/450
      setTimeout(this.open.bind(this), 0)
    }
  }

  onInputElementClick (evt) {
    evt.stopPropagation()
    if (this.props.inputProps && this.props.inputProps.onClick) {
      this.props.inputProps.onClick()
    }
  }

  onFileDialogCancel () {
    // timeout will not recognize context of this method
    const { onFileDialogCancel } = this.props
    // execute the timeout only if the FileDialog is opened in the browser
    if (this.isFileDialogActive) {
      setTimeout(() => {
        // Returns an object as FileList
        const { files } = this.fileInputEl

        if (!files.length) {
          this.isFileDialogActive = false
        }

        if (typeof onFileDialogCancel === 'function') {
          onFileDialogCancel()
        }
      }, 300)
    }
  }

  setRef (ref) {
    this.node = ref
  }

  setRefs (ref) {
    this.fileInputEl = ref
  }
  /**
   * Open system file upload dialog.
   *
   * @public
   */
  open () {
    this.isFileDialogActive = true
    this.fileInputEl.value = null
    this.fileInputEl.click()
  }

  renderChildren (children, isDragActive, isDragAccept, isDragReject) {
    if (typeof children === 'function') {
      return children({
        ...this.state,
        isDragActive,
        isDragAccept,
        isDragReject
      })
    }
    return children
  }

  render () {
    const {
      accept,
      // acceptClassName,
      // activeClassName,
      children,
      disabled,
      // disabledClassName,
      inputProps,
      multiple,
      name,
      // rejectClassName,
      ...rest
    } = this.props

    let {
      // acceptStyle,
      // activeStyle,
      // className = '',
      // disabledStyle,
      // rejectStyle,
      // style,
      ...props // eslint-disable-line prefer-const
    } = rest

    const { isDragActive, draggedFiles } = this.state
    const filesCount = draggedFiles.length
    const isMultipleAllowed = multiple || filesCount <= 1
    const isDragAccept =
      filesCount > 0 && allFilesAccepted(draggedFiles, this.props.accept)
    const isDragReject = filesCount > 0 && (!isDragAccept || !isMultipleAllowed)

    // const noStyles =
    //   !className && !style && !activeStyle && !acceptStyle && !rejectStyle && !disabledStyle
    //
    // if (isDragActive && activeClassName) {
    //   className += ' ' + activeClassName
    // }
    // if (isDragAccept && acceptClassName) {
    //   className += ' ' + acceptClassName
    // }
    // if (isDragReject && rejectClassName) {
    //   className += ' ' + rejectClassName
    // }
    // if (disabled && disabledClassName) {
    //   className += ' ' + disabledClassName
    // }
    //
    // if (noStyles) {
    //   style = styles.default
    //   activeStyle = styles.active
    //   acceptStyle = style.active
    //   rejectStyle = styles.rejected
    //   disabledStyle = styles.disabled
    // }
    //
    // let appliedStyle = { ...style }
    // if (activeStyle && isDragActive) {
    //   appliedStyle = {
    //     ...style,
    //     ...activeStyle
    //   }
    // }
    // if (acceptStyle && isDragAccept) {
    //   appliedStyle = {
    //     ...appliedStyle,
    //     ...acceptStyle
    //   }
    // }
    // if (rejectStyle && isDragReject) {
    //   appliedStyle = {
    //     ...appliedStyle,
    //     ...rejectStyle
    //   }
    // }
    // if (disabledStyle && disabled) {
    //   appliedStyle = {
    //     ...style,
    //     ...disabledStyle
    //   }
    // }

    const inputAttributes = {
      accept,
      disabled,
      type: 'file',
      style: { display: 'none' },
      multiple: supportMultiple && multiple,
      ref: this.setRefs,
      onChange: this.onDrop,
      autoComplete: 'off'
    }

    if (name && name.length) {
      inputAttributes.name = name
    }

    // Destructure custom props away from props used for the div element
    const {
      acceptedFiles,
      preventDropOnDocument,
      disablePreview,
      disableClick,
      onDropAccepted,
      onDropRejected,
      onFileDialogCancel,
      maxSize,
      minSize,
      ...divProps
    } = props

    return (
      <DropzoneWrapper
        // className={className}
        // style={appliedStyle}
        {
        ...divProps /* expand user provided props first so event handlers are never overridden */
        }
        onClick={this.composeHandlers(this.onClick)}
        onDragStart={this.composeHandlers(this.onDragStart)}
        onDragEnter={this.composeHandlers(this.onDragEnter)}
        onDragOver={this.composeHandlers(this.onDragOver)}
        onDragLeave={this.composeHandlers(this.onDragLeave)}
        onDrop={this.composeHandlers(this.onDrop)}
        ref={this.setRef}
        aria-disabled={disabled}
      >
        {this.renderChildren(
          children,
          isDragActive,
          isDragAccept,
          isDragReject
        )}
        <input
          {
          ...inputProps /* expand user provided inputProps first so inputAttributes override them */
          }
          {...inputAttributes}
        />
      </DropzoneWrapper>
    )
  }
}

export default Dropzone

Dropzone.propTypes = {
  /**
   * Allow specific types of files. See https://github.com/okonet/attr-accept for more information.
   * Keep in mind that mime type determination is not reliable across platforms. CSV files,
   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
   * Windows. In some cases there might not be a mime type set at all.
   * See: https://github.com/react-dropzone/react-dropzone/issues/276
   */
  accept: PropTypes.string,

  /**
   * Contents of the dropzone
   */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  /**
   * Disallow clicking on the dropzone container to open file dialog
   */
  disableClick: PropTypes.bool,

  /**
   * Enable/disable the dropzone entirely
   */
  disabled: PropTypes.bool,

  /**
   * Enable/disable preview generation
   */
  disablePreview: PropTypes.bool,

  /**
   * If false, allow dropped items to take over the current browser window
   */
  preventDropOnDocument: PropTypes.bool,

  /**
   * Pass additional attributes to the `<input type="file"/>` tag
   */
  inputProps: PropTypes.object,

  /**
   * Allow dropping multiple files
   */
  multiple: PropTypes.bool,

  /**
   * `name` attribute for the input tag
   */
  name: PropTypes.string,

  /**
   * Maximum file size
   */
  maxSize: PropTypes.number,

  /**
   * Minimum file size
   */
  minSize: PropTypes.number,

  /**
   * className
   */
  className: PropTypes.string,

  /**
   * className for active state
   */
  activeClassName: PropTypes.string,

  /**
   * className for accepted state
   */
  acceptClassName: PropTypes.string,

  /**
   * className for rejected state
   */
  rejectClassName: PropTypes.string,

  /**
   * className for disabled state
   */
  disabledClassName: PropTypes.string,

  /**
   * CSS styles to apply
   */
  style: PropTypes.object,

  /**
   * CSS styles to apply when drag is active
   */
  activeStyle: PropTypes.object,

  /**
   * CSS styles to apply when drop will be accepted
   */
  acceptStyle: PropTypes.object,

  /**
   * CSS styles to apply when drop will be rejected
   */
  rejectStyle: PropTypes.object,

  /**
   * CSS styles to apply when dropzone is disabled
   */
  disabledStyle: PropTypes.object,

  /**
   * onClick callback
   * @param {Event} event
   */
  onClick: PropTypes.func,

  /**
   * onDrop callback
   */
  onDrop: PropTypes.func,

  /**
   * onDropAccepted callback
   */
  onDropAccepted: PropTypes.func,

  /**
   * onDropRejected callback
   */
  onDropRejected: PropTypes.func,

  /**
   * onDragStart callback
   */
  onDragStart: PropTypes.func,

  /**
   * onDragEnter callback
   */
  onDragEnter: PropTypes.func,

  /**
   * onDragOver callback
   */
  onDragOver: PropTypes.func,

  /**
   * onDragLeave callback
   */
  onDragLeave: PropTypes.func,

  /**
   * Provide a callback on clicking the cancel button of the file dialog
   */
  onFileDialogCancel: PropTypes.func
}

Dropzone.defaultProps = {
  preventDropOnDocument: true,
  disabled: false,
  disablePreview: false,
  disableClick: false,
  multiple: false,
  maxSize: Infinity,
  minSize: 0
}

// Utils functions
export const supportMultiple =
  typeof document !== 'undefined' && document && document.createElement
    ? 'multiple' in document.createElement('input')
    : true

export function getDataTransferItems (event) {
  let dataTransferItemsList = []
  if (event.dataTransfer) {
    const dt = event.dataTransfer
    if (dt.files && dt.files.length) {
      dataTransferItemsList = dt.files
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      dataTransferItemsList = dt.items
    }
  } else if (event.target && event.target.files) {
    dataTransferItemsList = event.target.files
  }
  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList)
}

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// that MIME type will always be accepted
export function fileAccepted (file, accept) {
  // TODO: check the mimetype - we need to parse the mimetype
  // https://github.com/okonet/attr-accept/blob/master/src/index.js
  return accept === 'all' ? true : file.type === accept
}

export function fileMatchSize (file, maxSize, minSize) {
  return file.size <= maxSize && file.size >= minSize
}

export function allFilesAccepted (files, accept) {
  return files.every(file => fileAccepted(file, accept))
}

// allow the entire document to be a drag target
export function onDocumentDragOver (evt) {
  evt.preventDefault()
}
