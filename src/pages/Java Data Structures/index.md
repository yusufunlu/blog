---
title: Java Data Structures
date: '2022-02-19'
spoiler: Concurrency and Array, List, Map, Set, Table, Stack, Queue, Graph, Tree, Hash based ones, Tree based ones
---

This is a helpfull website to start https://www.bigocheatsheet.com/
# Basic Data Structures
# Arrays
https://docs.oracle.com/javase/specs/jls/se8/html/jls-10.html
https://www.javatpoint.com/array-in-java#:~:text=Java%20array%20is%20an%20object,in%20a%20contiguous%20memory%20location.&text=Java%20array%20inherits%20the%20Object,in%20an%20array%20in%20Java.
Arrays in Java 
- fixed size 
- sequential in memory
- similar data types
- inherits the Object, implements the Serializable and Cloneable interfaces
- int numbers[]=new int[5]; **declaration and instantiation**
- int numbers[]={33,3,4,5}; **declaration, instantiation and initialization**

# ArrayList
https://www.javatpoint.com/difference-between-arraylist-and-linkedlist
- It store data on an internal array **transient Object[] elementData**
- It can not store primitive types
- It has 3 constructors in Java 8, Java 7 has version only has 1 constructor
  1. ArrayList someArray = new ArrayList(); 
  2. new ArrayList(7) //default capacity is 10
  3. new ArrayList<String>(new LinkedList())
- Manipulation is slow because it internally uses an array. If any element is removed from the array, all array will be shifted
- It grows dynamically, If arraylist is full it create a new arraylist with %50 more capacity and copy all elements
the bits are shifted in memory.
- better for storing and accessing

# LinkedList 
- internally uses a doubly linked list to store the elements
- better for manipulating
- it implements List<E>, Deque<E>, Cloneable, java.io.Serializable

https://javaconceptoftheday.com/hashset-vs-linkedhashset-vs-treeset-in-java/
# HashSet
- All items are unique
- implements Set interface backend by hashtable which is actually hashmap
- doesn't preserve the order
- objects are inserted as based on their hashcode
- NULL is not allowed
- implements Serializable and Cloneable interfaces

## LinkedHashSet
## TreeSet
## ConcurrentHashMap
- it uses volatile semantics for get(key)
# ConcurrentSkipListMap
- isn't so fast, but is useful when you need sorted thread-safe map
- expected average log(n) time cost for the containsKey, get, put and remove operations and their variants
### TreeMap
### computeIfAbsent
### computeIfPresent
