<template>
  <div class="seek_bar" id="seekBar" ref="seekBar" @click="eventLine($event, Dragger.Click)">
    <div class="slider_line" ref="slider_line">
      <div class="slider_line_node" ref="nodeSlider" @mousedown="dragElement()">
        <span class="percentage" ref="percentage">{{ defaultPercentage }}%</span>
      </div>
    </div>
    <div class="line"></div>
    <SeekNodes :count="nodeCount" :size="nodeSize" :bg="nodeColor" :select-node="selected" :line-color="lineColor"
      :transition="transition" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType } from "vue"
import SeekNodes from "./seek-nodes"
const slider_line = ref()
const seekBar = ref()
const percentage = ref()
const nodeSlider = ref()
const props = defineProps({
  width: {
    type: Number as PropType<number>,
    default: 320,
    required: false,
  },
  colorTextPercent: {
    type: String as PropType<string>,
    default: 'black',
    required: false,
  },
  nodeSize: {
    type: Number as PropType<number>,
    default: 10,
    required: false,
  },
  nodeCount: {
    type: Number as PropType<number>,
    default: 4,
    required: false,
  },
  nodeColor: {
    type: String as PropType<string>,
    default: 'gray',
    required: false,
  },
  lineColor: {
    type: String as PropType<string>,
    default: 'yellow',
    required: false,
  },
  defaultPercentage: {
    type: Number as PropType<number>,
    default: 0,
    required: false,
  },
  transition: {
    type: Number as PropType<number>,
    default: 0.2,
    required: false,
  },
  attractionUnit: {
    type: Number as PropType<number>,
    default: 5,
    required: false,
  },
});
const selected = ref<number>(props.defaultPercentage)

enum Dragger {
  Touch = "Touch",
  Click = "Click",
}

interface NodeProperties {
  width: number,
  height: number,
  checked: boolean,
  left: number
}

onMounted(() => {
  const cssWidth = typeof props.width == "string" ? props.width : props.width + "px"
  if (seekBar.value !== null) {
    seekBar.value.style.width = cssWidth
  }
  touch()
  document.addEventListener('mouseup', function () {
    mouseupDragElement()
  });
})

function mouseupDragElement() {
  document.onmousemove = null;
}

function dragElement() {
  var client = 0
  let percent = 0
  const offset = seekBar.value.getBoundingClientRect()
  document.onmousemove = logKey;
  function logKey(e) {
    slider_line.value.style.transition = `width ${props.transition / 2}s`
    client = e.clientX;
    percent = Math.floor((((client - offset.left) - (props.nodeSize / 2)) / seekBar.value.clientWidth * 100));
    if (percent <= 0) {
      slider_line.value.style.width = 0 + '%'
      percentage.value.innerText = 0 + '%';
    } else if (percent >= 100) {
      slider_line.value.style.width = 100 + '%'
      percentage.value.innerText = 100 + '%';
    } else {
      slider_line.value.style.width = magnetNode(percent, props.nodeCount) + '%'
      percentage.value.innerText = magnetNode(percent, props.nodeCount) + '%';
    }
    selected.value = percent;
  }
}

function eventLine(e: MouseEvent | any, dragger: Dragger) {
  let percent: number
  const rect = seekBar.value.getBoundingClientRect();
  let x: number
  if (dragger === Dragger.Click) {
    slider_line.value.style.transition = `width ${props.transition}s`
    x = e.clientX - rect.left;
  } else {
    slider_line.value.style.transition = 'none';
    var touch = e.targetTouches[0];
    x = touch.clientX - rect.left;
  }
  percent = Math.floor((x - props.nodeSize / 2 + 1) / seekBar.value.clientWidth * 100)
  percent = magnetNode(percent, props.nodeCount)
  if (percent <= 0) percent = 0;
  if (percent >= 100) percent = 100;
  slider_line.value.style.width = percent + '%';
  percentage.value.innerText = percent + '%';
  selected.value = percent;
}

function magnetNode(percent: number, nodeCount: number) {
  const nodeSpace = 100 / nodeCount;
  let upper = 0;
  let lower = 0;
  for (let padding = 0; padding <= 100; padding += nodeSpace / props.attractionUnit) {
    if (padding > percent) {
      upper = padding;
    } else {
      lower = padding
    }
    if (upper > 0 && lower >= 0) {
      if (upper - props.attractionUnit < percent) {
        return upper;
      }
      if (lower + props.attractionUnit > percent) {
        return lower;
      }
    }
    if (percent < padding && percent > padding - padding) {
      break;
    }
  }
  return percent;
}

function touch() {
  seekBar.value.addEventListener('touchmove', function (event: TouchEvent) {
    eventLine(event, Dragger.Touch)
  }, false);
}

</script>

<style scoped>
.seek_bar {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  height: 20px;
}

.line {
  margin: 10px 0;
  width: 100%;
  height: 2px;
  background-color: v-bind(nodeColor);
}

.slider_line {
  left: 0;
  display: flex;
  align-items: center;
  position: absolute;
  width: v-bind(defaultPercentage + '%');
  height: 2px;
  background-color: v-bind(lineColor);
}

.slider_line_node {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  -ms-user-drag: none;

  display: inline-block;
  position: absolute;
  width: v-bind(nodeSize + 5 + "px");
  height: v-bind(nodeSize + 5 + "px");
  border-radius: 150px;
  right: -10px;
  background-color: v-bind(lineColor);
  z-index: 1;
}

.percentage {
  position: absolute;
  top: -25px;
  left: 0;
  font-size: 15px;
  color: v-bind(colorTextPercent)
}
</style>
