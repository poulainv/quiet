import { Box, Button, Heading, ResponsiveContext } from 'grommet'
import { MailOption } from 'grommet-icons'
import * as React from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import Logo from '../components/Logo'
import Separator from '../components/Separator'
// import artwork from '../static/images/artworks/landing-illustration-ld.png'
import { accent500, accent900, brand500 } from '../theme'

const Header = styled(Heading)`
    font-size: 52px;
    line-height: 1.3;
    font-weight: 700;
    max-width: 550px;
    margin: 25px 0px 25px 0px;
    font-family: 'Poiret One';

    @media screen and (max-width: 812px) {
        font-size: 26px;
        line-height: 36px;
        text-align: center;
    }
`

const SubHeader = styled.p`
    font-size: 20px;
    line-height: 28px;
    margin: 25px 0px 25px 0px;
    font-weight: 400;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI',
        Roboto, 'Helvetica Neue', Arial, sans-serif;
    @media screen and (max-width: 812px) {
        font-size: 16px;
        line-height: 22px;
        text-align: center;
    }
    strong {
        font-weight: 700;
    }
`

const CTAButton = styled.a`
    background-color: ${accent500};
    color: white;
    padding: 20px 40px 20px 40px;
    border-radius: 40px;
    text-decoration: none;
    font-family: inherit;
    font-size: 18px;
    width: max-content;
    font-weight: 600;
    @media screen and (max-width: 812px) {
        font-size: 16px;
        padding: 15px 30px 15px 30px;
    }

    :hover {
        background-color: ${accent900};
    }
`

const Artwork: React.FC = props => {
    const size = React.useContext(ResponsiveContext)
    const imageWidth =
        size === 'large' ? '624px' : size === 'medium' ? '412px' : '238px'
    return (
        <Box width={imageWidth}>
            <img
                alt="Artwork"
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                }}
                // src={artwork}
            />
        </Box>
    )
}

const handleCTA = () => {
    ReactGA.initialize('UA-149517534-1')
    ReactGA.event({
        category: 'Signup',
        action: 'Click on keepme',
    })
}

const Landing: React.FunctionComponent = props => {
    const size = React.useContext(ResponsiveContext)
    const isMobile = size === 'small'

    return (
        <Box
            align="center"
            background="white"
            height={size === 'large' ? 'full' : 'none'}
        >
            <Box
                direction="row"
                justify="between"
                align="center"
                height="xsmall"
                fill="horizontal"
            >
                <Box margin={{ horizontal: 'large' }}>
                    <Logo>Tottem</Logo>
                </Box>
                <Box margin={{ horizontal: 'large' }}>
                    <Button
                        plain={true}
                        href="mailto:hello@tottem.app"
                        icon={<MailOption />}
                    />
                </Box>
            </Box>

            <Box
                direction="row-responsive"
                justify="between"
                height={isMobile ? 'none' : 'full'}
            >
                <Box
                    align={isMobile ? 'center' : 'start'}
                    width="700px"
                    pad={{ horizontal: 'large' }}
                    margin={{ top: isMobile ? 'none' : 'medium' }}
                >
                    <Box align={isMobile ? 'center' : 'start'}>
                        <Header level={2}>
                            The knowledge platform for community COUCOU
                        </Header>
                        {isMobile && <Artwork />}
                        {size === 'large' && (
                            <Box margin={{ vertical: 'medium' }}>
                                <Separator color={brand500} />
                            </Box>
                        )}
                        <SubHeader>
                            Internet was built to support{' '}
                            <strong> knowledge sharing. </strong>
                            <br />
                            <br />
                            However, with the massive usage of AI recommendation
                            systems{' '}
                            <strong>
                                we feel overwhelmed with poor and clickbait
                                content.
                            </strong>
                            <br /> <br />
                            <em> Relevant content is getting hard to find? </em>
                            <br /> <br />
                            Tottem is a human centered platform where
                            enthusiastic people and organizations create{' '}
                            <strong>
                                relevant collections of hand-picked items.
                            </strong>
                        </SubHeader>
                    </Box>

                    <Box margin={{ top: 'large', bottom: '40px' }}>
                        <CTAButton
                            href="http://eepurl.com/gE44Sz"
                            onClick={handleCTA}
                        >
                            Keep me in the loop
                        </CTAButton>
                    </Box>
                </Box>
                {!isMobile && <Artwork />}
            </Box>
        </Box>
    )
}

export default Landing
