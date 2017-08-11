'use babel';

import EmmetJsxInlineStyleView from './emmet-jsx-inline-style-view';
import { CompositeDisposable } from 'atom';

export default {

  config:{
    "styleObjectName":{
      type: 'string',
      default: 'style'
    }
  },

  emmetJsxInlineStyleView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {

    if (atom.packages.isPackageLoaded('emmet')) {
      const pkgDir  = path.resolve(atom.packages.resolvePackagePath('emmet'), 'node_modules', 'emmet', 'lib')
      const emmet   = require(path.join(pkgDir, 'emmet'))
      const filters = require(path.join(pkgDir, 'filter', 'main'))

      filters.add('jsx-inline-style', (tree) => {
        const styleObjectName = atom.config.get('emmet-jsx-inline-style.styleObjectName') || 'style';
        tree.children.forEach((item) => {
          item.start = item.start.replace(/className="(.*?)"/, `style={${styleObjectName}.$1}`)
        })
      })

      // Apply jsx-css-modules after html so we can use a simple string replacement
      // and not have to mess with how the the html filter wraps attribute values with
      // quotation marks rather than curly brace pairs
      emmet.loadSnippets({"jsx": { "filters": "jsx, html, jsx-inline-style" }})
    }
  }

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.emmetJsxInlineStyleView.destroy();
  },

  serialize() {
    return {
      emmetJsxInlineStyleViewState: this.emmetJsxInlineStyleView.serialize()
    };
  },

  toggle() {
    console.log('EmmetJsxInlineStyle was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
