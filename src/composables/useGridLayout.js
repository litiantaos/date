import { ref, computed, reactive, nextTick } from 'vue'

const GRID_COLS = 7
const CELL_GAP = 16
const EXPANDED_CELL_HEIGHT_RATIO = 0.6
const EXPANDED_CELL_WIDTH_RATIO = 0.75
const VIEWPORT_CENTER_Y_RATIO = 3

export const useGridLayout = (viewport, calendarDays) => {
  const rows = computed(() => Math.ceil(calendarDays.value.length / GRID_COLS))

  // 视口尺寸和状态管理
  const viewportSize = reactive({ width: 0, height: 0 })
  const isExpanded = ref(false)
  const activeCell = ref(null)
  const rafId = ref(null)

  // DOM 元素高度计算
  const getElementHeight = (selector) =>
    viewport.value?.querySelector(selector)?.offsetHeight || 0
  const getNavHeight = () => getElementHeight('.calendar-nav')
  const getWeekTitleHeight = () => getElementHeight('.calendar-week')

  // 性能优化
  const updateLayout = (callback) => {
    if (rafId.value) cancelAnimationFrame(rafId.value)
    rafId.value = requestAnimationFrame(() => {
      callback()
      rafId.value = null
    })
  }

  // 计算展开状态下的网格尺寸
  const calculateExpandedGridSize = () => {
    const expandedCellHeight = viewportSize.height * EXPANDED_CELL_HEIGHT_RATIO
    const expandedCellWidth = expandedCellHeight * EXPANDED_CELL_WIDTH_RATIO
    return {
      width: expandedCellWidth * GRID_COLS + (GRID_COLS - 1) * CELL_GAP,
      height: expandedCellHeight * rows.value + (rows.value - 1) * CELL_GAP,
      cellWidth: expandedCellWidth,
      cellHeight: expandedCellHeight,
    }
  }

  // 计算单元格位置
  const calculateCellPosition = (index) => ({
    row: Math.floor(index / GRID_COLS),
    col: index % GRID_COLS,
  })

  // 网格容器样式计算
  const gridContainerStyle = computed(() => {
    if (!isExpanded.value) {
      return {
        width: '100%',
        height: `calc(100vh - ${getNavHeight()}px)`,
        transform: 'translate(0, 0)',
      }
    }

    const {
      width: gridWidth,
      height: gridHeight,
      cellWidth,
      cellHeight,
    } = calculateExpandedGridSize()
    if (activeCell.value === null) return { width: '100%', height: '100%' }

    const { row, col } = calculateCellPosition(activeCell.value)
    const viewportCenterX = viewportSize.width / 2
    const viewportCenterY = viewportSize.height / VIEWPORT_CENTER_Y_RATIO

    const cellOffsetX = col * (cellWidth + CELL_GAP) + cellWidth / 2
    const cellOffsetY = row * (cellHeight + CELL_GAP) + cellHeight / 2

    document.body.style.overflow = 'hidden'

    return {
      width: `${gridWidth}px`,
      height: `${gridHeight}px`,
      transform: `translate(${viewportCenterX - cellOffsetX}px, ${viewportCenterY - cellOffsetY}px)`,
      '--cell-width-expanded': `${cellWidth}px`,
      '--cell-height-expanded': `${cellHeight}px`,
      '--cell-gap': `${CELL_GAP}px`,
    }
  })

  // 单元格样式缓存
  const cellStylesCache = new Map()

  // 单元格样式计算
  const getCellStyle = (index) => {
    const cacheKey = `${index}-${isExpanded.value}-${viewportSize.width}-${viewportSize.height}-${rows.value}`
    if (cellStylesCache.has(cacheKey)) return cellStylesCache.get(cacheKey)

    const { row, col } = calculateCellPosition(index)
    let style

    if (isExpanded.value) {
      style = {
        width: 'var(--cell-width-expanded)',
        height: 'var(--cell-height-expanded)',
        transform: `translate(
          calc(${col} * (var(--cell-width-expanded) + var(--cell-gap))),
          calc(${row} * (var(--cell-height-expanded) + var(--cell-gap)))
        )`,
      }
    } else {
      const cellWidth = viewportSize.width / GRID_COLS
      const availableHeight =
        viewportSize.height - getNavHeight() - getWeekTitleHeight()
      const cellHeight = availableHeight / rows.value

      style = {
        width: `${cellWidth}px`,
        height: `${cellHeight}px`,
        transform: `translate(${col * cellWidth}px, ${row * cellHeight}px)`,
      }
    }

    cellStylesCache.set(cacheKey, style)
    return style
  }

  // 视口尺寸更新
  const updateViewportSize = () => {
    if (!viewport.value) return

    const { clientWidth: newWidth, clientHeight: newHeight } = viewport.value
    if (newWidth === viewportSize.width && newHeight === viewportSize.height)
      return

    updateLayout(() => {
      viewportSize.width = newWidth
      viewportSize.height = newHeight
      cellStylesCache.clear()

      if (isExpanded.value && activeCell.value !== null) {
        nextTick(() => handleCellClick(activeCell.value, true))
      }
    })
  }

  // 单元格点击处理
  const handleCellClick = (index, isResizing = false) => {
    if (!calendarDays.value[index]) return

    if (isExpanded.value && activeCell.value === index && !isResizing) {
      updateLayout(() => {
        isExpanded.value = false
        activeCell.value = null
        document.body.style.overflow = ''
      })
      return
    }

    if (!isResizing) {
      updateLayout(() => {
        activeCell.value = index
        isExpanded.value = true
      })
    }
  }

  // 资源清理
  const cleanup = () => {
    if (rafId.value) cancelAnimationFrame(rafId.value)
    document.body.style.overflow = ''
  }

  return {
    isExpanded,
    activeCell,
    gridContainerStyle,
    getCellStyle,
    handleCellClick,
    updateViewportSize,
    cleanup,
  }
}
