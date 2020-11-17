import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Image as CachedImage} from "react-native-expo-image-cache";
import { imageBase64 } from '../processes/db'

export default class Image extends Component {
    constructor(props){
        super(props)
    }
    
    // preview can be a local image or a data uri;
    render(){
        const {uri, preview, style} = this.props
        return <CachedImage style={style} {...{preview, uri}} />
    }    
}

Image.defaultProps = {
    preview: { uri: imageBase64() }
}

Image.propTypes = {
    uri: PropTypes.string.isRequired,
    style: PropTypes.shape({
        height: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        width: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        borderRadius: PropTypes.number,
        borderBottomLeftRadius: PropTypes.number,
        borderTopLeftRadius: PropTypes.number,
    })
}