const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    chainWebpack: config => {
    	config.resolve
	    	.alias
	    	.set('vue$', 'vue/dist/vue.esm-bundler.js') // 用 webpack 1 时需用 'vue/dist/vue.common.js'
	  	
        config.module
          	.rule('vue')
          	.use('vue-loader')
          	.loader('vue-loader')
          	.tap(options => {
            	options.compilerOptions = {
              		...(options.compilerOptions || {}),
              		isCustomElement: tag => /^my-/.test(tag)
            	};
            return options;
          	})
    },
    transpileDependencies: true,
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/style/_variables.scss";
                `
            }
        }
    },
})
