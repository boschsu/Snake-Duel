import { h } from 'vue';
interface Props {
	[key: string]:any;
}
interface Context {
	slots:any,
	attrs:any,
	emit:any,
	expose?:any,
}
function WorldGenerator(props: Props, context: Context){
	// const ButtonCounter = resolveComponent('ButtonCounter')
	return h(
		'div',
		{
			on:{
				changing:function(e:any){
					console.log('Oh yahh got you.')
				},
			},
			order: props.order,
			class:'world-generator',
		},
		context.slots.default()
	);
}
export default WorldGenerator