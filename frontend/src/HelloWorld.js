import React from 'react';

const HelloWorld = () => {
  
  function sayHello() {
    alert('Yo!');
  }
  
  return (
    <button onClick={sayHello}>Click me!</button>
  );
};

export default HelloWorld;    