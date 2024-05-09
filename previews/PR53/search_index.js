var documenterSearchIndex = {"docs":
[{"location":"#API","page":"API","title":"API","text":"","category":"section"},{"location":"","page":"API","title":"API","text":"@compact_structs\n@sum_structs\n@dispatch\nkindof\nallkinds\nkindconstructor","category":"page"},{"location":"#MixedStructTypes.@compact_structs","page":"API","title":"MixedStructTypes.@compact_structs","text":"@compact_structs(type_definition, structs_definitions)\n\nThis macro allows to combine multiple types in a single one.  This version has been built to yield a performance almost  identical to having just one type.\n\nExample\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1)\nA(1)::AB\n\njulia> a.x\n1\n\n\n\n\n\n","category":"macro"},{"location":"#MixedStructTypes.@sum_structs","page":"API","title":"MixedStructTypes.@sum_structs","text":"@sum_structs(type_definition, structs_definitions)\n\nThis macro allows to combine multiple types in a single one.  While its usage is equivalent to @compact_structs, this version consumes less memory at the cost of being slower.\n\nExample\n\njulia> @sum_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1)\nA(1)::AB\n\njulia> a.x\n1\n\nSee the introduction page of the documentation for a more advanced example.\n\n\n\n\n\n","category":"macro"},{"location":"#MixedStructTypes.@dispatch","page":"API","title":"MixedStructTypes.@dispatch","text":"@dispatch(function_definition)\n\nThis macro allows to dispatch on types created by @compact_structs or @sum_structs. Notice that this only works when the kinds in the macro are not wrapped by any type containing them.\n\nExample\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> @dispatch f(::A) = 1;\n\njulia> @dispatch f(::B) = 2;\n\njulia> @dispatch f(::Vector{B}) = 3; # this doesn't work\nERROR: UndefVarError: `B` not defined\nStacktrace:\n [1] top-level scope\n   @ REPL[7]:1\n\njulia> f(A(0))\n1\n\njulia> f(B(0))\n2\n\n\n\n\n\n","category":"macro"},{"location":"#MixedStructTypes.kindof","page":"API","title":"MixedStructTypes.kindof","text":"kindof(instance)\n\nReturn a symbol representing the conceptual type of an instance:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindof(a)\n:A\n\n\n\n\n\n","category":"function"},{"location":"#MixedStructTypes.allkinds","page":"API","title":"MixedStructTypes.allkinds","text":"allkinds(type)\n\nReturn a Tuple containing all kinds associated with the overarching  type defined with @compact_structs or @sum_structs:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> allkinds(AB)\n(:A, :B)\n\n\n\n\n\n","category":"function"},{"location":"#MixedStructTypes.kindconstructor","page":"API","title":"MixedStructTypes.kindconstructor","text":"kindconstructor(instance)\n\nReturn the constructor of an instance:\n\njulia> @compact_structs AB begin\n           struct A x::Int end\n           struct B y::Int end\n       end\n\njulia> a = A(1);\n\njulia> kindconstructor(a)\nA\n\n\n\n\n\n","category":"function"}]
}