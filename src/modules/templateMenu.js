module.exports = {
    template: [{
        label: 'File',
        submenu: [{
                label: 'New Product',
                accelerator: 'Ctrl+N',
                click() {
                    createNewProductWindow();
                }
            },
            {
                label: 'Remove all products',
                click() {

                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }],
    checkPlatform: function() {
        if (process.platform == 'darwin') { //Mostrar el nombre de la aplicación en el menú para Mac
            this.template.unshift({
                label: app.getName()
            });
        }
        if (process.env.NODE_ENV !== 'production') {
            this.template.push({
                label: 'Devtools',
                submenu: [{
                        label: 'Show/Hide DevTools',
                        accelerator: 'Ctrl+D',
                        click(item, focusedWindow) {
                            focusedWindow.toggleDevTools();
                        }
                    },
                    {
                        role: 'reload'
                    }
                ]
            })
        }
    }
}