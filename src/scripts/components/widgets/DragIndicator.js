/* @flow */

import styled from 'styled-components'

import { TRANSITION_STATE } from 'constants/ApplicationConstants'

const DEFAULT_DIMENSION: number = 15

const DragIndicator = styled.div.attrs({
  style: ({
    currentValuePercentage,
    draggingPercentage,
    transitionState,
    dimension
  }) => ({
    transform: `scale(${
      !transitionState || transitionState === TRANSITION_STATE.ENTERED
        ? 1.0
        : 0.0
    })`,
    left: draggingPercentage
      ? `calc(${Math.max(
        0,
        Math.min(100, draggingPercentage)
      )}% - ${(dimension || DEFAULT_DIMENSION) / 2}px)`
      : `calc(${Math.max(
        0,
        Math.min(100, currentValuePercentage)
      )}% - ${(dimension || DEFAULT_DIMENSION) / 2}px)`
  })
})`
  position: absolute;
  cursor: pointer;
  width: ${({ dimension }) => dimension || DEFAULT_DIMENSION}px;
  height: ${({ dimension }) => dimension || DEFAULT_DIMENSION}px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.bar.scrubber};
  transition: transform ${({ theme }) => theme.animation.time.repaint}
    ${({ theme }) => theme.animation.ease.smooth};
`

export default DragIndicator
