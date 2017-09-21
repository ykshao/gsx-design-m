/**
 * Created by gsx on 16/1/20.
 */
define(function (require) {
    'use strict';

    var env = require('../../util/env');
    var math = require('../../../util/math');
    var observer = require('../../../util/mvc/observer');

    var currentImagePlayer;

    return function (images, index, titleArray, needScale) {
        index = math.clamp(index || 0, 0, 1000);

        if (currentImagePlayer) {
            currentImagePlayer.destroy();
            currentImagePlayer = null;
        }

        titleArray = titleArray || [];

        if (env.app.isApp) {
            app.send('toViewImages', {
                img_list: images,
                index: index
            });
        } else {
            require(['../../../component/ImagePlayer/index'], function (ImagePlayer) {
                var imgPlayer = new ImagePlayer(
                    images, 
                    {
                        index: index,
                        needScale: needScale
                    }, 
                    titleArray
                );
                var listener = observer.addListener(imgPlayer, 'display_changed', function () {
                    var display = this.get('display');
                    if (!display) {
                        observer.removeListener(listener);
                        currentImagePlayer = null;
                        imgPlayer.destroy();
                    }
                });
                currentImagePlayer = imgPlayer;
                imgPlayer.show();
            });
        }
    };
});