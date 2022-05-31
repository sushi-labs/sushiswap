import Footer from 'app/components/Footer'
import Header from 'app/components/Header'
import Main from 'app/components/Main'
import Popups from 'app/components/Popups'

// @ts-ignore TYPE NEEDS FIXING
const Layout = ({ children }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <Main>{children}</Main>
      <Popups />
      <Footer />
    </div>
  )
}

export default Layout
