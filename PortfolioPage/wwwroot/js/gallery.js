var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fadeInEffects = [
    'fade-in'
    //'appear-from-top'
];
const fadeOutEffects = [
    'fade-out'
    //'dissapear-to-top'
];
class Gallery {
    constructor(galleryContainer, filterClass, fullScreen) {
        this._pictures = this._initElements(galleryContainer);
        this._filters = this._initFilters(filterClass);
        this._fullScreenElement = this._initFullScreen(fullScreen);
        this._hideModalFunction = () => this._closeFullScreen();
    }
    _initElements(containerClass) {
        this._galleryContainer = document.getElementsByClassName(containerClass)[0];
        let pictures = this._convertElementsToArray(this._galleryContainer.children);
        this._addEventListnerOnClickToFullMode(pictures);
        return pictures;
    }
    _addEventListnerOnClickToFullMode(imgPreviews) {
        imgPreviews.forEach(img => {
            img.addEventListener('click', (event) => {
                event.stopPropagation();
                let target = this._extractTaget(event);
                let imgContainer = target.localName === 'img' ? target.parentElement : target;
                let src = imgContainer.getAttribute('data-original');
                if (src) {
                    this._setImgToFullScreen(src);
                    this._openFullScreen();
                }
            });
        });
    }
    _initFilters(filterClass) {
        let filters = this._convertElementsToArray(document.getElementsByClassName(filterClass));
        filters.forEach(elem => {
            elem.addEventListener('click', (event) => {
                this._unselectTags();
                this._applyFilter(event);
                this._setTagSelected(this._extractTaget(event));
            });
        });
        return filters;
    }
    _initFullScreen(fullscreenClass) {
        let fullScreen = document.getElementsByClassName(fullscreenClass)[0];
        return fullScreen;
    }
    _convertElementsToArray(collection) {
        let array = [];
        for (var i = 0; i < collection.length; i++) {
            array.push(collection.item(i));
        }
        return array;
    }
    _applyFilter(filter) {
        filter.stopPropagation();
        const target = this._extractTaget(filter);
        let tag = this._getTagsFromFilter(target);
        this._setPicturesVisability(tag);
    }
    _extractTaget(event) {
        return event.target;
    }
    _setTagSelected(filter) {
        filter.classList.add('selected');
    }
    _unselectTags() {
        this._filters.forEach(filter => {
            filter.classList.remove('selected');
        });
    }
    _getTagsFromFilter(filter) {
        return filter.textContent.toLocaleLowerCase();
    }
    _setPicturesVisability(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            let matched = tag == 'all' ? this._pictures : this._pictures.filter(pic => { return this._isPictureContainsTag(tag, pic); });
            yield this._hidePictures(this._pictures);
            this._switchGallery();
            this._addToGalleryContainer(matched);
            this._showPictures(matched);
        });
    }
    _switchGallery() {
        let galleryClone = document.createElement('div');
        let galleryParent = this._galleryContainer.parentElement;
        galleryParent.removeChild(this._galleryContainer);
        galleryClone.classList.add(this._galleryContainer.classList.value);
        galleryClone.id = this._galleryContainer.id;
        galleryClone.setAttribute('height', String(this._galleryContainer.clientHeight));
        galleryParent.appendChild(galleryClone);
        this._galleryContainer = galleryClone;
    }
    _showPictures(pictures) {
        let effect = this._chooseEffect(fadeInEffects);
        pictures.forEach(pic => {
            pic.classList.add(effect);
        });
        setTimeout(() => {
            pictures.forEach(pic => {
                pic.classList.remove(effect);
            });
        }, 1000);
    }
    _hidePictures(pictures) {
        let effect = this._chooseEffect(fadeOutEffects);
        pictures.forEach(pic => {
            pic.classList.add(effect);
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                pictures.forEach(pic => {
                    pic.classList.remove(effect);
                });
                resolve();
            }, 1000);
        });
    }
    _chooseEffect(effectList) {
        let index = Math.floor(Math.random() * (effectList.length - 0));
        return effectList[index];
    }
    _removeFromGalleryContainer(pics) {
        pics.forEach(pic => this._galleryContainer.removeChild(pic));
    }
    _addToGalleryContainer(pics) {
        pics.forEach(pic => {
            this._galleryContainer.appendChild(pic);
        });
    }
    _isPictureContainsTag(tag, picture) {
        const tagsInPic = this._getTagsFromPicture(picture);
        const index = tagsInPic.indexOf(tag);
        return index > -1;
    }
    _getTagsFromPicture(picture) {
        let rawAttribute = picture.getAttribute('data-group');
        let attr = rawAttribute.split(' ');
        return attr.map(tag => tag.toLocaleLowerCase());
    }
    _setImgToFullScreen(src) {
        this._fullScreenElement.getElementsByTagName('img')[0].src = src;
    }
    _openFullScreen() {
        this._fullScreenElement.classList.remove('hidden');
        this._fullScreenElement.classList.add('full-screen_appear');
        this._fullScreenElement.classList.remove('full-screen_disappear');
        document.addEventListener('click', this._hideModalFunction, false);
    }
    _closeFullScreen() {
        this._fullScreenElement.classList.remove('full-screen_appear');
        this._fullScreenElement.classList.add('full-screen_disappear');
        document.removeEventListener('click', this._hideModalFunction, false);
    }
}
//# sourceMappingURL=gallery.js.map