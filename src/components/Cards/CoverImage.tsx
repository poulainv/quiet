import React from 'react'
import { Stack, Box, Image } from 'grommet'
import ShadowCover from '../ShadowCover'

interface CoverProps {
    imageUrl: string
    imageColor?: string
    size: string
    imageShape?: 'rectangle' | 'square' | 'circle' // assume rectangle by default
}

const CoverImage: React.FC<CoverProps> = props => {
    // FIXME
    let imageHeight
    if (props.imageShape === 'rectangle') {
        imageHeight = props.size === 'small' ? '230px' : '246px'
    } else {
        imageHeight = props.size === 'small' ? '170px' : '170px'
    }
    return (
        <Stack anchor="bottom">
            <Box
                round={props.imageShape === 'circle' ? '50%' : '4px'}
                height={{ max: imageHeight }}
                width={props.imageShape !== 'rectangle' ? imageHeight : 'auto'}
                overflow="hidden"
            >
                <Image src={props.imageUrl} fit="cover" />
            </Box>
            {props.imageColor && <ShadowCover color={props.imageColor} />}
        </Stack>
    )
}
CoverImage.defaultProps = { imageShape: 'rectangle' }

export default CoverImage
