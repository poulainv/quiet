import { Box, Button, Image } from 'grommet'
import { Link, Youtube } from 'grommet-icons'
import React from 'react'
import { ISocial } from '../types'

const Social: React.FC<ISocial> = props => {
    const pictoHeight = '15px'
    return (
        <Box direction="row" height={pictoHeight} gap="medium" align="end">
            {props.mail && (
                <Box>
                    <Button
                        plain={true}
                        href={'mailto:' + props.mail}
                        icon={
                            <Image
                                height="14px"
                                src={'/pictograms/mail.svg'}
                                fit="contain"
                            />
                        }
                    />
                </Box>
            )}

            {props.github && (
                <Box>
                    <Button
                        target="_blank"
                        plain={true}
                        href={props.github}
                        icon={
                            <Image
                                height={pictoHeight}
                                src={'/pictograms/github.svg'}
                                fit="contain"
                            />
                        }
                    />
                </Box>
            )}

            {props.linkedin && (
                <Box>
                    <Button
                        target="_blank"
                        plain={true}
                        href={props.linkedin}
                        icon={
                            <Image
                                height={pictoHeight}
                                src={'/pictograms/linkedin.svg'}
                                fit="contain"
                            />
                        }
                    />
                </Box>
            )}
            {props.website && (
                <Box>
                    <Button
                        target="_blank"
                        plain={true}
                        href={props.website}
                        icon={
                            <Link style={{ height: '18px', width: 'auto' }} />
                        }
                    />
                </Box>
            )}

            {props.youtube && (
                <Box>
                    <Button
                        target="_blank"
                        plain={true}
                        href={props.youtube}
                        icon={
                            <Youtube
                                style={{ height: '18px', width: 'auto' }}
                            />
                        }
                    />
                </Box>
            )}
        </Box>
    )
}

export default Social
