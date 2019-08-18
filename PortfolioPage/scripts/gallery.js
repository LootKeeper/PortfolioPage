var Gallery = /** @class */ (function () {
    function Gallery(galleryContainer, filterClass) {
        this._pictures = this._initElements(galleryContainer);
        this._filters = this._initFilters(filterClass);
    }
    Gallery.prototype._initElements = function (containerClass) {
        var pictures = this._convertElementsToArray(document.getElementsByClassName(containerClass));
        return pictures;
    };
    Gallery.prototype._initFilters = function (filterClass) {
        var _this = this;
        var filters = this._convertElementsToArray(document.getElementsByClassName(filterClass));
        filters.forEach(function (elem) {
            elem.addEventListener('click', function (event) {
                _this._unselectTags();
                _this._applyFilter(event);
                _this._setTagSelected(_this._extractTager(event));
            });
        });
        return filters;
    };
    Gallery.prototype._convertElementsToArray = function (collection) {
        var array = [];
        for (var i = 0; i < collection.length; i++) {
            array.push(collection.item(i));
        }
        return array;
    };
    Gallery.prototype._applyFilter = function (filter) {
        filter.stopPropagation();
        var target = this._extractTager(filter);
        var tag = this._getTagsFromFilter(target);
        this._setPicturesVisability(tag);
    };
    Gallery.prototype._extractTager = function (event) {
        return event.target;
    };
    Gallery.prototype._setTagSelected = function (filter) {
        filter.classList.add('selected');
    };
    Gallery.prototype._unselectTags = function () {
        this._filters.forEach(function (filter) {
            filter.classList.remove('selected');
        });
    };
    Gallery.prototype._getTagsFromFilter = function (filter) {
        return filter.textContent.toLocaleLowerCase();
    };
    Gallery.prototype._setPicturesVisability = function (tag) {
        var _this = this;
        if (tag == 'all') {
            this._showPictures(this._pictures);
        }
        else {
            var matched = this._pictures.filter(function (pic) { return _this._isPictureContainsTag(tag, pic); });
            var unmatched = this._pictures.filter(function (pic) { return !_this._isPictureContainsTag(tag, pic); });
            this._hidePictures(unmatched);
            this._showPictures(matched);
        }
    };
    Gallery.prototype._showPictures = function (pictures) {
        pictures.forEach(function (pic) {
            pic.classList.remove('hidden');
        });
    };
    Gallery.prototype._hidePictures = function (pictures) {
        pictures.forEach(function (pic) {
            pic.classList.add('hidden');
        });
    };
    Gallery.prototype._isPictureContainsTag = function (tag, picture) {
        var tagsInPic = this._getTagsFromPicture(picture);
        return tagsInPic.indexOf(tag) > 0;
    };
    Gallery.prototype._getTagsFromPicture = function (picture) {
        return picture.getAttribute('data-group').map(function (tag) { return tag.toLocaleLowerCase(); });
    };
    return Gallery;
}());
//# sourceMappingURL=gallery.js.map