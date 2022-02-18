---
title: Java Data Structures
date: '2022-02-19'
spoiler: Concurrency and Array, List, Map, Set, Table, Stack, Queue, Graph, Tree, Hash based ones, Tree based ones
---

This is a helpfull website to start https://www.bigocheatsheet.com/
# Basic Data Structures
https://docs.oracle.com/javase/specs/jls/se8/html/jls-10.html
Arrays in Java 
- fixed size 
- sequential in memory
- similar data types
- inherits the Object
- implements the Serializable as well as Cloneable interfaces
- int numbers[]=new int[5]; **declaration and instantiation**
- int numbers[]={33,3,4,5}; **declaration, instantiation and initialization**
- Manipulation with ArrayList is slow because it internally uses an array. If any element is removed from the array, all the bits are shifted in memory.
- better for storing and accessing
- Default capacity is 10. 
- If arraylist is full it create a new arraylist with %50 more capacity and copy from all elements

# LinkedList 
- internally uses a doubly linked list to store the elements
- better for manipulating
- it implements List<E>, Deque<E>, Cloneable, java.io.Serializable
  

# ConcurrentHashMap
- it uses volatile semantics for get(key)
# ConcurrentSkipListMap
- isn't so fast, but is useful when you need sorted thread-safe map
- expected average log(n) time cost for the containsKey, get, put and remove operations and their variants
# TreeMap
# computeIfAbsent
# computeIfPresent

