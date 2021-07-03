import React from 'react';
import { Grid, makeStyles, Typography, Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 60,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  },
  link: {
    cursor: "pointer"
  }
}));

const NotFound = () => {
  const classes = useStyles();
  const history = useHistory();
  
  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <Typography variant="h5">
              404: Halaman yang kamu tuju tidak ada disini
            </Typography>
            <Typography variant="subtitle2">
              Anda mencoba mengakses url secara langsung atau anda datang ke sini karena kesalahan. <br /> 
              Apapun itu, coba gunakan navigasi. Klik&nbsp;
                <Link
                    underline='none' 
                    onClick={() => history.goBack()}
                    className={classes.link}
                >
                    disini
                </Link> untuk kembali
            </Typography>
            <img
              alt="Under development"
              className={classes.image}
              src={`${process.env.PUBLIC_URL}/images/undraw_page_not_found_su7k.svg`}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;