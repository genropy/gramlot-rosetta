// Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
// Browser adapter for TYTX's optional Node-style codec lookup.
import * as msgpack from '@msgpack/msgpack';
import * as tytxMsgpack from '/pages/assets/tytx/msgpack.js';


export function createRequire() {
    return name => {
        if (name === '@msgpack/msgpack') return msgpack;
        if (name === './msgpack.js') return tytxMsgpack;
        throw new Error(`Optional Node module unavailable in browser: ${name}`);
    };
}
