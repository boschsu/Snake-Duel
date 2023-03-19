import { h } from 'vue';
function MyComponent(props:any, context:any) {
	return h(
		props.type,
		{},
		props.content
	);
}
export default MyComponent