import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,  } from 'recharts';
import PropTypes from 'prop-types';

const Graph = props => {
    return(
        <Card>
            <CardHeader title='Pengularan' subheader="Grafik pengeluaran tahun ini dan sebelumnya" />
            <Divider />
            <CardContent style={{height: '60vh'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={props.data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="curyear" stroke="#8884d8" name="Tahun ini" fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="prevyear" stroke="#82ca9d" name="Tahun sebelumnya" fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

Graph.propTypes = {
    data: PropTypes.array.isRequired,
}

export default Graph;