<script setup lang="ts">
type TrendChartPoint = {
  dateKey: string
  dayLabel: string
  x: number
  postHeight: number
  postY: number
  isToday: boolean
}

type TrendChart = {
  width: number
  height: number
  padding: {
    left: number
    right: number
    bottom: number
  }
  mapped: TrendChartPoint[]
}

type Props = {
  trendKickerLabel: string
  trendHeadingLabel: string
  todayPostsLabel: string
  chartPostsLegendLabel: string
  todayPosts: number
  trendChart: TrendChart
}

const props = defineProps<Props>()
</script>

<template>
  <section id="blog-trend" class="rounded-2xl border border-[#2a2a2a] bg-[#111111d1] p-3 sm:p-4">
    <div class="grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-stretch">
      <div class="rounded-xl border border-[#2b2b2b] bg-[#141414] p-3">
        <p class="text-xs uppercase tracking-[0.11em] text-zinc-500">{{ props.trendKickerLabel }}</p>
        <h3 class="mt-1 text-base font-semibold text-zinc-100 sm:text-lg">{{ props.trendHeadingLabel }}</h3>
        <div class="mt-3">
          <div class="rounded-lg border border-[#313131] bg-[#161616] px-2.5 py-1.5 text-right">
            <p class="text-[11px] text-zinc-500">{{ props.todayPostsLabel }}</p>
            <p class="text-sm font-semibold text-zinc-100">{{ props.todayPosts }}</p>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-[#2b2b2b] bg-[#141414] p-2 sm:p-3">
        <div class="mb-2 flex items-center justify-end gap-3 text-[11px] text-zinc-400">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-sm bg-[#6f93ff]"></span>
            {{ props.chartPostsLegendLabel }}
          </span>
        </div>

        <svg
          class="h-[196px] w-full"
          :viewBox="`0 0 ${props.trendChart.width} ${props.trendChart.height}`"
          role="img"
          aria-label="Blog trend chart"
        >
          <line
            :x1="props.trendChart.padding.left"
            :x2="props.trendChart.width - props.trendChart.padding.right"
            :y1="props.trendChart.height - props.trendChart.padding.bottom"
            :y2="props.trendChart.height - props.trendChart.padding.bottom"
            stroke="#2f2f2f"
            stroke-width="1"
          />

          <g v-for="point in props.trendChart.mapped" :key="`trend-point-${point.dateKey}`">
            <rect
              :x="point.x - 9"
              :y="point.postY"
              width="18"
              :height="point.postHeight"
              rx="4"
              fill="#6f93ff"
              :fill-opacity="point.isToday ? '0.95' : '0.72'"
            />
            <text
              :x="point.x"
              :y="props.trendChart.height - 9"
              text-anchor="middle"
              class="fill-zinc-400 text-[10px]"
            >
              {{ point.dayLabel }}
            </text>
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>
