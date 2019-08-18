const fadeInEffects = [
    'fade-in'
    //'appear-from-top'
];

const fadeOutEffects = [
    'fade-out'
    //'dissapear-to-top'
];

class Gallery {

    _galleryContainer: Element;
    _pictures: Element[];
    _filters: Element[];
    _fullScreenElement: Element;

    _hideModalFunction: any;

    constructor(galleryContainer: string, filterClass: string, fullScreen: string) {
        this._pictures = this._initElements(galleryContainer);
        this._filters = this._initFilters(filterClass);
        this._fullScreenElement = this._initFullScreen(fullScreen);

        this._hideModalFunction = () => this._closeFullScreen();
    }

    _initElements(containerClass: string): Element[] {
        this._galleryContainer = document.getElementsByClassName(containerClass)[0];
        let pictures = this._convertElementsToArray(this._galleryContainer.children);
        this._addEventListnerOnClickToFullMode(pictures);
        return pictures;
    }

    _addEventListnerOnClickToFullMode(imgPreviews: Element[]) {
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
            })
        })
    }

    _initFilters(filterClass: string): Element[] {
        let filters = this._convertElementsToArray(document.getElementsByClassName(filterClass))
        filters.forEach(elem => {
            elem.addEventListener('click', (event) => {
                this._unselectTags();
                this._applyFilter(event);
                this._setTagSelected(this._extractTaget(event));
            });
        })
        return filters;
    }

    _initFullScreen(fullscreenClass: string): Element {
        let fullScreen = document.getElementsByClassName(fullscreenClass)[0];
        return fullScreen;
    }

    _convertElementsToArray(collection: HTMLCollectionOf<Element>) {
        let array = [];
        for (var i = 0; i < collection.length; i++) {
            array.push(collection.item(i));
        }
        return array;
    }

    _applyFilter(filter: Event) {
        filter.stopPropagation();
        const target = this._extractTaget(filter);
        let tag = this._getTagsFromFilter(target);
        this._setPicturesVisability(tag);
    }

    _extractTaget(event: Event): Element {
        return event.target as Element;
    }

    _setTagSelected(filter: Element) {
        filter.classList.add('selected');
    }

    _unselectTags() {
        this._filters.forEach(filter => {
            filter.classList.remove('selected');
        })
    }

    _getTagsFromFilter(filter: Element): string {
        return filter.textContent.toLocaleLowerCase();
    }

    async _setPicturesVisability(tag: string) {
        let matched = tag == 'all' ? this._pictures : this._pictures.filter(pic => { return this._isPictureContainsTag(tag, pic) });
        await this._hidePictures(this._pictures);
        this._switchGallery();
        this._addToGalleryContainer(matched);
        this._showPictures(matched);
    }

    _switchGallery() {
        let galleryClone = document.createElement('div');
        let galleryParent = this._galleryContainer.parentElement;
        galleryParent.removeChild(this._galleryContainer);
        galleryClone.classList.add(this._galleryContainer.classList.value);
        galleryClone.id = this._galleryContainer.id;
        galleryParent.appendChild(galleryClone);
        this._galleryContainer = galleryClone;
    }

    _showPictures(pictures: Element[]) {
        let effect = this._chooseEffect(fadeInEffects);
        pictures.forEach(pic => {
            pic.classList.add(effect);            
        });
        setTimeout(() => {
            pictures.forEach(pic => {                
                pic.classList.remove(effect);
            })
        }, 1000);
    }

    _hidePictures(pictures: Element[]): Promise<void> {
        let effect = this._chooseEffect(fadeOutEffects);
        pictures.forEach(pic => {
            pic.classList.add(effect);
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                pictures.forEach(pic => {
                    pic.classList.remove(effect);
                })
                resolve();
            }, 1000);
        });
    }

    _chooseEffect(effectList: string[]): string {
        let index = Math.floor(Math.random() * (effectList.length - 0));
        return effectList[index];
    }

    _removeFromGalleryContainer(pics: Element[]) {
        pics.forEach(pic => this._galleryContainer.removeChild(pic));
    }

    _addToGalleryContainer(pics: Element[]) {
        pics.forEach(pic => {            
            this._galleryContainer.appendChild(pic)
        });
    }

    _isPictureContainsTag(tag: string, picture: Element): boolean {
        const tagsInPic = this._getTagsFromPicture(picture);
        const index = tagsInPic.indexOf(tag);
        return index > -1;
    }

    _getTagsFromPicture(picture: Element): string[] {
        let rawAttribute = picture.getAttribute('data-group');
        let attr = rawAttribute.split(' ');
        return attr.map(tag => tag.toLocaleLowerCase());
    }

    _setImgToFullScreen(src: string) {
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