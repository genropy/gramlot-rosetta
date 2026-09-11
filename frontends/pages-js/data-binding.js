root.data('live_message', 'Hello World');
root.h1('^live_message');
root.textBox({value: '^live_message', lbl: 'Live', live: true});
root.data('message', 'Hello World');
root.h1('^message');
root.textBox({value: '^message', lbl: 'On focus out'});
