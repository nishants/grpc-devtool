

Refer: https://www.electronforge.io/



```
yarn create electron-app app

```



Configuring : 

- parameters: https://www.electronforge.io/configuration
- package config options : https://electron.github.io/electron-packager/master/interfaces/electronpackager.options.html#name
- icon: https://stackoverflow.com/questions/48790003/setting-platform-dependant-icon-via-electron-forge-electronpackagerconfig

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
      "icon": "assets/icons/icon"
    }
	}
}


```

- Initial config : 