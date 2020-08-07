# -*- coding: utf-8 -*-
# %% define
a = 1
b = 2
# c = 3
# %% print
print(a)
print(b)
# %% [markdown]
# # title with right color
# ## title with right color
# ### title with right color
# ##### title with right color
# ###### title with right color
# ####### 7# is not title
# # <- Wrong bold (the first green #)
# 
# the `raw string` is ok  
# the **bold** is ok, _italic_ *italic*  
# 
# [link](link.md)
# ![img](imgimgimg.img)
# 
# > quote is break
# > 123 321 123
# 
# + asd
# - asd
#   + asd
#   + asd
# - asd
# 1. asdasdas
#   1. asdasdas
#     1. asdasdas
# 2. asdasd
# 1. asd
# 
# + asd
# ------
# + as
#   + sda
# 
# 
# this should not break the cell
# ```
# as
# ```
# [but](link.md)

# %% [markdown]
# this should break the cell
# ``` 
# a=1
b=2
print(b)
# ```
# [so](link.md)

#%%

def abc(c):
    a=1
    b=2
    return a,b

abc(abc(1))