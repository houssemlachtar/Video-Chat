import React, { useContext } from 'react'
import { Grid, Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
    
import { SocketContext } from '../SocketContext'

const useStyles = makeStyles((theme) => ({
    video: {
        width: '550px',
        [theme.breakpoints.down('xs')]: {
            width: '300px',
        },
    },
    gridContainer: {
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    paper: {
        padding: '10px',
        border: '2px solid black',
        margin: '10px',
    }
}))

const VideoPlayer = () => {
    const classes = useStyles()
    const { name, mVideo, uVideo, call, callAccepted, callEnded, stream } = useContext(SocketContext)

    return (
        <Grid container className={classes.gridContainer}>

            {/* Local video */}
            
            {
                stream && ( // show video if stream present
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{ name || 'NAME' }</Typography>
                            <video playsInline muted ref={mVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
                )
            }
            
            {/* Users video */}

            {
                callAccepted && !callEnded && ( // show video if call accepted and not ended
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{ call.name || 'NAME' }</Typography>
                            <video playsInline ref={uVideo} autoPlay className={classes.video} />
                        </Grid> 
                    </Paper> 
                )
            }
            

        </Grid>
    
  )
}

export default VideoPlayer