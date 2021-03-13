

Refer: https://www.electronforge.io/



```
yarn create electron-app app

```



Configuring : 

- parameters: https://www.electronforge.io/configuration
- package config options : https://electron.github.io/electron-packager/master/interfaces/electronpackager.options.html#name

```yaml
# app/package.json

"config": {
	"forge": {
		packagerConfig: { 
      "name": "GrpcDevtool",
      "out": "dist",
      "overwrite" : true,
      "appCategoryType": "app-category-type=public.app-category.developer-tools", 
      "darwinDarkModeSupport": true,
      "icon": "path/to/icon.icns"

    }
	}
}


```

- Initial config : 