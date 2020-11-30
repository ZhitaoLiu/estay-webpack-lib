import React, { memo } from 'react'

import './index.less';

export default memo(function index() {
    return (
        <div className="app">
            webpack template test
        </div>
    )
})


ReactDOM.render(<App />, document.getElementById('root'));