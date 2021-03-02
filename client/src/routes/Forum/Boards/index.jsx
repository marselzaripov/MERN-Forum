import { useContext, useEffect, useState } from 'react';

import { StoreContext } from 'store/Store';

import { Section } from 'components/Section';
import Breadcrumbs from 'components/Breadcrumbs';
import SortNav from 'components/SortNav';
import { BoardCard } from 'components/Card';
import Loader from 'components/Loader';
import Errorer from 'components/Errorer';

import Default from './Default';
import Popular from './Popular';
import NewestAnswer from './NewestAnswer';
import NewestThread from './NewestThread';
import Answers from './Answers';

const Boards = () => {
  document.title = 'Forum | Boards'
  const { setPostType, setFabVisible } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    if (init) {
      setFabVisible(true)
      setPostType({
        type: 'thread',
        id: null
      })
    }
    setInit(false)
  }, [setInit, init, setPostType, setFabVisible])

  return (
    <Section>
      <Breadcrumbs current="All boards" links={[
        { title: 'Home', link: '/' }
      ]} />

      <SortNav links={[
        { title: 'Default', sort: 'default' },
        { title: 'Popular', sort: 'popular' },
        { title: 'Recently answered', sort: 'newestanswer' },
        { title: 'By newest thread', sort: 'newestthread' },
        { title: 'By answers count', sort: 'answers' }
      ]} setSort={setSort} state={sort} />

      {sort === 'popular' && <Popular />}
      {sort === 'newestanswer' && <NewestAnswer />}
      {sort === 'newestthread' && <NewestThread />}
      {sort === 'answers' && <Answers />}
      {sort === 'default' && <Default />}
    </Section>
  )
}

export default Boards;
