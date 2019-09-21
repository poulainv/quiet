import { Box, Tabs, Tab, ResponsiveContext } from 'grommet'

import React, { useState, useContext } from 'react'
import Collection from '../Collection'
import sections from '../../data/thinkerview/sections'

import { ICollection, Section } from '../../types'
import TabTitle from '../Tab'

const Main: React.FC = () => {
    const size = useContext(ResponsiveContext)
    const [activeTab, setActiveTab] = useState(0)

    return (
        <Box pad={{ horizontal: size === 'large' ? 'none' : 'large' }}>
            <Tabs justify="start" onActive={setActiveTab}>
                {sections.map((section: Section, index: number) => {
                    return (
                        <Tab
                            key={section.id}
                            title={
                                <TabTitle
                                    size={size}
                                    title={section.name}
                                    active={activeTab === index}
                                />
                            }
                        >
                            <Box
                                direction="column"
                                width="large"
                                border={{
                                    color: 'light-2',
                                    size: '1px',
                                    side: 'top',
                                }}
                            >
                                {section.collections.map(
                                    (collection: ICollection) => {
                                        return (
                                            <Collection
                                                key={collection.name}
                                                {...collection}
                                            />
                                        )
                                    }
                                )}
                            </Box>
                        </Tab>
                    )
                })}
            </Tabs>
        </Box>
    )
}

export default Main
