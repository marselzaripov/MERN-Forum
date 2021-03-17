import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { BACKEND, Strings } from 'support/Constants';

import Header from './Header';
import LeftMenu from './LeftMenu';
import Footer from './Footer';
import Modal from 'components/Modal';
import './style.css';

const Layout = ({ children }) => {
  const { user, token, modalOpen, setModalOpen, postType, setPostType, fab, lang } = useContext(StoreContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const coverOpen = menuOpen || modalOpen  ? 'cover open' : 'cover'

  const [onlineIndicator, setOnlineIndicator] = useState(0)

  useEffect(() => {
    if (user) {
      updateLastSeen()
      setOnlineIndicator(setInterval(() => updateLastSeen(), 60000))
    }

    return () => {
      clearInterval(onlineIndicator)
    }
  }, [user])

  const updateLastSeen = () => {
    fetch(BACKEND + '/api/profile/setOnline', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => response.json())
      .catch(console.error)
  }

  const fabClick = () => {
    setModalOpen(!modalOpen)
  }

  const coverClick = () => {
    menuOpen && setMenuOpen(false)
    modalOpen && setModalOpen(false)
  }

  const modalClose = () => {
    if (
      postType.type === 'answer' ||
      postType.type === 'answerEdit' ||
      postType.type === 'userThreadEdit' ||
      postType.type === 'adminThreadEdit'
    ) {
      setPostType({
        type: 'answer',
        id: postType.id
      })
    }
    setModalOpen(false)
  }

  useEffect(() => {
    if (menuOpen || modalOpen) {
      document.body.classList.add('noscroll')
    } else {
      document.body.classList.remove('noscroll')
    }
  }, [menuOpen, modalOpen])

  return (
    <Fragment>
      <Header setMenuState={() => setMenuOpen(!menuOpen)} />

      <section className="container">
        <LeftMenu open={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="content">
          {children}

          <Footer />
        </main>

        {user && fab && (
          <div className="fab" onClick={fabClick}>
            {postType.type === 'answer' ? (
              <Fragment>
                <span>{Strings.answer[lang]}</span>
                <i className="bx bx-pencil" />
              </Fragment>
            ) : postType.type === 'upload' ? (
              <Fragment>
                <span>{Strings.newFile[lang]}</span>
                <i className="bx bx-cloud-upload" />
              </Fragment>
            ) : (
              <Fragment>
                <span>{Strings.createNew[lang]}</span>
                <i className="bx bx-pencil" />
              </Fragment>
            )}
          </div>
        )}
      </section>

      {user && modalOpen && <Modal open={modalOpen} close={modalClose} />}

      <div className={coverOpen} onClick={coverClick} />
    </Fragment>
  )
}

export default Layout;
