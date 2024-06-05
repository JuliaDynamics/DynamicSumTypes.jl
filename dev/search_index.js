var documenterSearchIndex = {"docs":
[{"location":"#API","page":"API","title":"API","text":"","category":"section"},{"location":"","page":"API","title":"API","text":"@sum_structs\n@pattern\nkindof\nallkinds\nkindconstructor","category":"page"},{"location":"#DynamicSumTypes.@sum_structs","page":"API","title":"DynamicSumTypes.@sum_structs","text":"@sum_structs [version] type_definition begin\n    structs_definitions\nend\n\nThis macro allows to combine multiple types in a single one.  The default version is :opt_speed which has been built to yield  a performance almost identical to having just one type. Using :opt_memory consumes less memory at the cost of being a bit slower.\n\nExample\n\njulia> @sum_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1)\nA(1)::AB\n\njulia> a.x\n1\n\n\n\n\n\n","category":"macro"},{"location":"#DynamicSumTypes.@pattern","page":"API","title":"DynamicSumTypes.@pattern","text":"@pattern(function_definition)\n\nThis macro allows to pattern on types created by @sum_structs. \n\nNotice that this only works when the kinds in the macro are not wrapped  by any type containing them.\n\nExample\n\njulia> @sum_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> @pattern f(::A) = 1;\n\njulia> @pattern f(::B) = 2;\n\njulia> @pattern f(::Vector{AB}) = 3; # this works \n\njulia> @pattern f(::Vector{B}) = 3; # this doesn't work\nERROR: LoadError: It is not possible to dispatch on a variant wrapped in another type\n...\n\njulia> f(A(0))\n1\n\njulia> f(B(0))\n2\n\njulia> f([A(0), B(0)])\n3\n\n\n\n\n\n","category":"macro"},{"location":"#DynamicSumTypes.kindof","page":"API","title":"DynamicSumTypes.kindof","text":"kindof(instance)\n\nReturn a symbol representing the conceptual type of an instance:\n\njulia> @sum_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindof(a)\n:A\n\n\n\n\n\n","category":"function"},{"location":"#DynamicSumTypes.allkinds","page":"API","title":"DynamicSumTypes.allkinds","text":"allkinds(type)\n\nReturn a Tuple containing all kinds associated with the overarching  type defined with @sum_structs\n\njulia> @sum_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> allkinds(AB)\n(:A, :B)\n\n\n\n\n\n","category":"function"},{"location":"#DynamicSumTypes.kindconstructor","page":"API","title":"DynamicSumTypes.kindconstructor","text":"kindconstructor(instance)\n\nReturn the constructor of an instance:\n\njulia> @sum_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindconstructor(a)\nA\n\n\n\n\n\n","category":"function"}]
}
