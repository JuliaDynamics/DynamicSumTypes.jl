# DynamicSumTypes.jl

[![CI](https://github.com/JuliaDynamics/DynamicSumTypes.jl/workflows/CI/badge.svg)](https://github.com/JuliaDynamics/DynamicSumTypes.jl/actions?query=workflow%3ACI)
[![](https://img.shields.io/badge/docs-stable-blue.svg)](https://juliadynamics.github.io/DynamicSumTypes.jl/stable/)
[![codecov](https://codecov.io/gh/JuliaDynamics/DynamicSumTypes.jl/graph/badge.svg?token=rz9b1WTqCa)](https://codecov.io/gh/JuliaDynamics/DynamicSumTypes.jl)
[![Aqua QA](https://raw.githubusercontent.com/JuliaTesting/Aqua.jl/master/badge.svg)](https://github.com/JuliaTesting/Aqua.jl)

This package allows to combine multiple heterogeneous types in a single one. This helps to write 
type-stable code by avoiding Union-splitting, which has big performance drawbacks when many types are 
unionized. 

Another aim of this library is to provide a syntax as similar as possible to standard Julia 
structs to facilitate its integration within other libraries. 

The `@sum_structs` macro implements two strategies to create a compact representation of the types: 
the default one merges all fields of each struct in a unique type which is faster in many cases, 
while the second uses [SumTypes.jl](https://github.com/MasonProtter/SumTypes.jl) under the hood, 
which is more memory efficient and allows to mix mutable and immutable structs.

Even if there is only a unique type defined by this macro, you can access a symbol containing the conceptual 
type of an instance with the function `kindof` and use the `@pattern` macro to define functions which 
can operate differently on each kind.

## Construct mixed types

```julia
julia> using DynamicSumTypes

julia> abstract type AbstractA{X} end

julia> # default version is :on_fields
       @sum_structs A{X} <: AbstractA{X} begin
           @kwdef mutable struct B{X}
               a::X = 1
               b::Float64 = 1.0
           end
           @kwdef mutable struct C{X}
               a::X = 2
               c::Bool = true
           end
           @kwdef mutable struct D{X}
               a::X = 3
               const d::Symbol = :s
           end
           @kwdef mutable struct E{X}
               a::X = 4
           end
       end

julia> b = A'.B(1, 1.5)
B{Int64}(1, 1.5)::A

julia> export_variants(A)

julia> b = B(1, 1.5)
B{Int64}(1, 1.5)::A

julia> b.a
1

julia> b.a = 3
3

julia> kindof(b)
:B

julia> abstract type AbstractF{X} end

julia> @sum_structs :on_types F{X} <: AbstractF{X} begin
           @kwdef mutable struct G{X}
               a::X = 1
               b::Float64 = 1.0
           end
           @kwdef mutable struct H{X}
               a::X = 2
               c::Bool = true
           end
           @kwdef mutable struct I{X}
               a::X = 3
               const d::Symbol = :s
           end
           @kwdef mutable struct L{X}
               a::X = 4
           end
       end

julia> g = F'.G(1, 1.5)
G{Int64}(1, 1.5)::F

julia> export_variants(F)

julia> g = G(1, 1.5)
G{Int64}(1, 1.5)::F

julia> g.a
1

julia> g.a = 3
3

julia> kindof(g)
:G
```

## Define functions on the mixed types

There are currently two ways to define function on the types created 
with this package:

- Use manual branching;
- Use the `@pattern` macro.

For example, let's say we want to create a sum function where different values are added
depending on the kind of each element in a vector:

```julia
julia> function sum1(v) # with manual branching
           s = 0
           for x in v
               if kindof(x) === :B
                   s += value_B(1)
               elseif kindof(x) === :C
                   s += value_C(1)
               elseif kindof(x) === :D
                   s += value_D(1)
               elseif kindof(x) === :E
                   s += value_E(1)
               else
                   error()
               end
           end
           return s
       end
sum1 (generic function with 1 method)

julia> value_B(k::Int) = k + 1;

julia> value_C(k::Int) = k + 2;

julia> value_D(k::Int) = k + 3;

julia> value_E(k::Int) = k + 4;

julia> function sum2(v) # with @pattern macro
           s = 0
           for x in v
               s += value(1, x)
           end
           return s
       end
sum2 (generic function with 1 method)

julia> @pattern value(k::Int, ::B) = k + 1;

julia> @pattern value(k::Int, ::C) = k + 2;

julia> @pattern value(k::Int, ::D) = k + 3;

julia> @pattern value(k::Int, ::E) = k + 4;

julia> v = A{Int}[rand((B,C,D,E))() for _ in 1:10^6];

julia> sum1(v)
2499517

julia> sum2(v)
2499517
```

As you can see the version using the `@pattern` macro is much less verbose and more intuitive. In some more
advanced cases the verbosity of the first approach could be even stronger.

Since the macro essentially reconstruct the branching version described above, to ensure that everything will 
work correctly when using it, do not define functions operating on the main type of some variants without 
using the `@pattern` macro. 

Also, if you use it in a module or in a script run from the command line, you will need to use `@finalize_patterns` 
at some point to make sure that the functions using the macro are defined, usually you will only need one 
invocation after all the rest of the code.

Consult the [API page](https://juliadynamics.github.io/DynamicSumTypes.jl/stable/) for more information on 
the available functionalities.

## Benchmark against a `Union` of types

Let's see briefly how the two macros compare performance-wise in respect to a `Union` of types:

```julia
julia> @kwdef mutable struct M{X}
           a::X = 1
           b::Float64 = 1.0
       end

julia> @kwdef mutable struct N{X}
           a::X = 2
           c::Bool = true
       end

julia> @kwdef mutable struct O{X}
           a::X = 3
           const d::Symbol = :s
       end

julia> @kwdef mutable struct P{X}
           a::X = 4
       end

julia> vec_union = Union{M{Int},N{Int},O{Int},P{Int}}[rand((M,N,O,P))() for _ in 1:10^6];

julia> vec_sum_on_types = F{Int}[rand((G,H,I,L))() for _ in 1:10^6];

julia> vec_sum_on_fields = A{Int}[rand((B,C,D,E))() for _ in 1:10^6];

julia> Base.summarysize(vec_union)
22003112

julia> Base.summarysize(vec_sum_on_types)
30004176

julia> Base.summarysize(vec_sum_on_fields)
48000040

julia> using BenchmarkTools

julia> @btime sum(x.a for x in $vec_union);
  26.886 ms (999805 allocations: 15.26 MiB)

julia> @btime sum(x.a for x in $vec_sum_on_types);
  6.585 ms (0 allocations: 0 bytes)

julia> @btime sum(x.a for x in $vec_sum_on_fields);
  1.747 ms (0 allocations: 0 bytes)
```

In this case, `@sum_structs :on_fields` types are almost 15 times faster than `Union` ones, even if they require more than
double the memory. Whereas, as expected, `@sum_structs :on_types` types are less time efficient, but the memory increase 
in respect to `Union` types is smaller.

## Contributing

Contributions are welcome! If you encounter any issues, have suggestions for improvements, or would like to add new 
features, feel free to open an issue or submit a pull request.
