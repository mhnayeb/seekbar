import { h, PropType, defineComponent } from "vue"
import seekNode from "./seek-node"

export default defineComponent({
    props: {
        count: {
            type: Number as PropType<number>,
            required: false,
            default: 5
        },
        size: {
            type: Number as PropType<number>,
            required: false,
            default: 10
        },
        bg: {
            type: String as PropType<string>,
            required: false,
            default: "gray"
        },
        selectNode: {
            type: Number as PropType<number>,
            required: false,
            default: "gray"
        },
        lineColor: {
            type: String as PropType<string>,
            default: 'yellow',
            required: false,
        },
        transition: {
            type: Number as PropType<Number>,
            default: 0.5,
            required: false,
        },
    },
    render(props) {
        const inc = 100 / props.count
        return Array.from({ length: props.count + 1 }).map(
            (left => _ => {
                left += inc;
                if (props.selectNode >= left) {
                    return h(seekNode,
                        {
                            size: props.size,
                            bg: props.lineColor,
                            textColor: props.bg,
                            left,
                        })
                } else {
                    return h(seekNode,
                        {
                            size: props.size,
                            bg: props.bg,
                            textColor: props.bg,
                            left,
                        })
                }
            })(-inc)
        )
    }
})
