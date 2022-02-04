---
title: Deep Learning
date: '2022-01-30'
spoiler: Artificial Neuron Models, Perceptron Learning, Neural Nets versus Biological Networks,Feed-Forward Architectures. Gradient Descent Learning, Stochastic Gradient Descent, GD With Momentum, Nesterov Accelerated Gradient (NAG), Activation Functions, Learning Rate, Optimization; Issues of Convergence, Overfitting, Generalization.
cta: 'Neural Network'
---

Convolutional Neural Networks(CNN): Good for image recognition
Long Short-term memory network(LSTM): Good for speech recognition

**Neuron**: holds a number between 0-1.
Sigmoid Function or σ(x) or sig(x)= 1/(1+e^-x) = 1/(1+exp(-x)) When x goes to +etheral f(x) goes to 1, in contrast when x goes to - etheral f(x) goes to 0
ReLU: 𝑓(𝑥)=max(0,𝑥) there are other types of relu also
**Matrix Product**: 3x2 matrix has 3 rows and 2 columns, 2x3 matrix has 2 rows and 3 columns, can be productable eachother

# Pytorch Installation
We will need Python 3. 
I have a macbook pro 2020 which has 2.7 python as default
python --version -> 2.7.18
# Way 1 Install Python 3 and make alias
I have installed python3 already but system still use python2
So we need to make alias python to python3 using **alias python='python3'** in **~/.bash_profile**
Do not try to remove default python 2.7

# Way 2 Install Anaconda and create enviroment for different Python interpreters
If you install anaconda package manager it also install own python interpreter.
After installing anaconda type **conda** command to get into conda shell, you will have another version of python3

You can create enviroments so there are some commands to manage it

``conda create --name env_name python=3.7`` 
``conda activate env_name``
``conda install matplotlib numpy jupyter``
``conda deactivate``
``conda env list``


