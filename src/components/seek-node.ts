import { h, defineComponent, PropType } from "vue";

export default defineComponent({
    props: {
        left: {
            type: Number as PropType<number>,
            default: 0
        },
        size: {
            type: Number as PropType<number>,
            default: 10
        },
        bg: {
            type: String as PropType<string>,
            required: false,
            default: "gray"
        },
        textColor: {
            type: String as PropType<string>,
            required: false,
            default: "gray"
        },
        selectNode: {
            type: Number as PropType<number>,
            required: false,
            default: 0,
        }
    },
    setup(props) {        
        return () => h(
            'div',
            {
                style: {
                    left: props.left + '%',
                    position: "absolute",
                    borderRadius: "150px",
                    backgroundColor: props.bg,
                    width: props.size + "px",
                    height: props.size + "px",
                    fontSize: props.size + "px",
                    zIndex: 0,
                }
            },
            [
                h('span', {
                    class: 'percentage',
                    innerText: Math.floor(props.left) + '%',
                    style: {
                        position: 'absolute',
                        left: 0,
                        bottom: '-25px',
                        color: props.textColor
                    }
                })
            ]
        )
    }
})