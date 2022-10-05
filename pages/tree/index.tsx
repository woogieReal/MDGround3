import TreeSection from '@/components/tree/sections/treeSection'
import ViewSection from '@/components/tree/sections/viewSection'
import { Grid } from '@mui/material'
import type { NextPage } from 'next'

const Home: NextPage = () => {

  return (
    <Grid>
      <TreeSection/>
      <ViewSection/>
    </Grid>
  )
}

export default Home
