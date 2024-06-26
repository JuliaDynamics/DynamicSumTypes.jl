
using DynamicSumTypes, Test

@sum_structs X{T1, T2, T3} begin
    struct A1 end
    struct B1{T3, T1}
        a::T1 
        c::T3
    end
    struct C1{T2} 
        b::T2
    end
end

export_variants(X)

@sum_structs :on_types Y{T1, T2, T3} begin
    struct D1 end
    struct E1{T1, T3}
        a::T1 
        c::T3
    end
    struct F1{T2} 
        b::T2
    end
end

@sum_structs :on_fields Z{T1, T2, T3} begin
    struct G1{T1, T2, T3} end
    struct H1{T1, T2, T3}
        a::T1 
        c::T3
    end
    struct I1{T1, T2, T3}
        b::T2
    end
end

@pattern g(x::X, q, a::X) = -10
@pattern g(x::B1, q, a::A1) = -1
@pattern g(x::B1, q::Int, a::A1) = 0
@pattern g(x::B1, q::Int, b::B1) = 1
@pattern g(x::B1, q::Int, c::C1) = 2
@pattern g(a::A1, q::Int, c::B1) = 3

@pattern g(a::A1, q::Int, c::B1{Int}; s = 1) = 10 + s
@pattern g(a::A1, q::Int, c::C1{Int}; s = 1) = 11 + s
@pattern g(a::X, q::Int, c::X{DynamicSumTypes.Uninitialized, Int}; s = 1) = 12 + s

@pattern g(x::X, q::Vararg{Int, 2}) = 1000
@pattern g(x::A1, q::Vararg{Int, 2}) = 1001

@pattern g(x::X, q::Vararg{Any, N}) where N = 2000
@pattern g(x::A1, q::Vararg{Any, N}) where N = 2001

@pattern g(a::Y'.E1, b::Int, c::Y'.D1) = 0
@pattern g(a::Y'.E1, b::Int, c::Y'.E1) = 1
@pattern g(a::Y'.E1, b::Int, c::Y'.F1) = 2
@pattern g(a::Y'.D1, b::Int, c::Y'.E1) = 3
@pattern g(a::Y'.E1, b::Int, c::Y'.F1) = 4

@pattern g(a::B1, b::Int, c::Vector{<:X}) = c

@pattern g(a::Z'.H1{Int}, b::Z'.G1{Int}, c::Z'.I1{Int}) = a.a + c.b
@pattern g(a::Z'.G1{Int}, b::Z'.G1{Int}, c::Z'.I1{Int}) = c.b
@pattern g(a::Z'.H1{Float64}, b::Z'.G1{Float64}, c::Z'.I1{Float64}) = a.a

@pattern g(a::X, q::Int, c::X{Int}; s = 1) = 12 + s

@finalize_patterns

@pattern t(::A1) = 100

@finalize_patterns

@testset "@pattern" begin
    
    a, b1, b2, c = A1(), B1(0.0, 0.0), B1(1.0, 1.0), C1(1.0)

    @test g(a, true, c) == -10
    @test g(a, 1, c) == -10
    @test g(b1, true, a) == -1
    @test g(b1, 1, a) == 0
    @test g(b1, 1, b2) == 1
    @test g(b1, 1, c) == 2
    @test g(a, 1, b1) == 3

    b3, c3 = B1(1, 1), C1(1)
    @test g(c3, 1, c3) == 13
    @test g(a, 1, c3) == 12
    @test g(a, 1, b3) == 11

    @test g(a, 1, 1) == 1001
    @test g(b1, 1, 1) == 1000
    @test g(c, 1, 1) == 1000
    @test g(a, 1, 1, :a) == 2001
    @test g(b1, 1, 1, :b) == 2000
    @test g(c, 1, 1, :c) == 2000

    d, e1, e2, f = Y'.D1(), Y'.E1(1, 1), Y'.E1(1.0, 1.0), Y'.F1(1)

    @test g(e1, 1, d) == 0
    @test g(e1, 1, e2) == 1
    @test g(e1, 1, f) == 4
    @test g(d, 1, e1) == 3

    @test g(B1(1,1), 1, [A1()]) == [A1()]

    g1, h1, i1 = Z'.G1{Int, Int, Int}(), Z'.H1{Int, Int, Int}(1, 1), Z'.I1{Int, Int, Int}(5)
    g2, h2, i2 = Z'.G1{Float64, Float64, Float64}(), Z'.H1{Float64, Float64, Float64}(1, 1), Z'.I1{Float64, Float64, Float64}(1)

    @test g(h1, g1, i1) == 6
    @test g(g1, g1, i1) == 5
    @test g(h2, g2, i2) == 1.0
    @test t(A1()) == 100
end
