import { Fragment, useContext, useEffect, useState } from 'react';
import { StoreContext } from 'store/Store';
import { useMutation } from '@apollo/client';

import Header from './Header';
import LeftMenu from './LeftMenu';
import Footer from './Footer';
import Modal from 'components/Modal';
import './style.css';

import { EDIT_USER } from 'support/Mutations';

const Layout = ({ children }) => {
  const { user, modalOpen, setModalOpen, postType, setPostType, fab } = useContext(StoreContext)
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

  const [updateLastSeenMutation] = useMutation(EDIT_USER)

  const updateLastSeen = () => {
    updateLastSeenMutation({
      variables: {
        id: user.id,
        onlineAt: new Date().toISOString()
      }
    })
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
                <span>Answer</span>
                <i className="bx bx-pencil"></i>
              </Fragment>
            ) : (
              <Fragment>
                <span>Create new</span>
                <i className="bx bx-pencil"></i>
              </Fragment>
            )}
          </div>
        )}
      </section>

      {user && modalOpen && <Modal open={modalOpen} close={modalClose} />}

      <div className={coverOpen} onClick={coverClick}></div>
    </Fragment>
  )
}

export default Layout;
